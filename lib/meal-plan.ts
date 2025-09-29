import { generateObject } from 'ai'
import { plannerModel, systemPrompts } from '@/lib/ai'
import { z } from 'zod'
import type { UserMetricsInput, MetricsResult } from '@/lib/calculations'

// Zod schema for structured meal plan output
export const mealPlanSchema = z.object({
  totalCalories: z.number().describe('Total de calorias do dia'),
  macros: z.object({
    protein: z.number().describe('Proteínas em gramas'),
    carbs: z.number().describe('Carboidratos em gramas'),
    fat: z.number().describe('Gorduras em gramas')
  }),
  meals: z.array(
    z.object({
      name: z.string().describe('Nome da refeição (ex: Café da manhã, Almoço)'),
      time: z.string().describe('Horário sugerido (ex: 7h00, 12h30)'),
      calories: z.number().describe('Calorias da refeição'),
      foods: z.array(
        z.object({
          item: z.string().describe('Nome do alimento'),
          quantity: z.string().describe('Quantidade em medida caseira (ex: 1 xícara, 100g)'),
          calories: z.number().describe('Calorias do item')
        })
      )
    })
  ),
  notes: z.string().optional().describe('Observações e dicas adicionais')
})

export type MealPlan = z.infer<typeof mealPlanSchema>

export interface MealPlanRequest {
  userInput: UserMetricsInput
  metrics: MetricsResult
  preferences?: string[]
  restrictions?: string[]
}

export async function generateMealPlan(request: MealPlanRequest): Promise<MealPlan> {
  const { userInput, metrics, preferences = [], restrictions = [] } = request

  // Build detailed prompt for GPT-5
  const prompt = buildMealPlanPrompt(userInput, metrics, preferences, restrictions)

  try {
    const result = await generateObject({
      model: plannerModel,
      system: systemPrompts.planner,
      prompt,
      schema: mealPlanSchema,
      temperature: 0.7,
    })

    return result.object
  } catch (error) {
    console.error('Error generating meal plan:', error)
    throw new Error('Não foi possível gerar o plano alimentar. Tente novamente.')
  }
}

function buildMealPlanPrompt(
  userInput: UserMetricsInput,
  metrics: MetricsResult,
  preferences: string[],
  restrictions: string[]
): string {
  const { age, height, weight, gender, activityLevel, goal } = userInput
  const { tdee, macros } = metrics

  const goalMap = {
    cutting: 'definição muscular e perda de gordura',
    maintenance: 'manutenção do peso corporal',
    bulking: 'ganho de massa muscular (hipertrofia)'
  }

  return `
Crie um plano alimentar detalhado e personalizado para uma pessoa com o seguinte perfil:

**Dados Pessoais:**
- Idade: ${age} anos
- Sexo: ${gender === 'female' ? 'feminino' : 'masculino'}
- Altura: ${height} cm
- Peso: ${weight} kg
- Nível de atividade: ${activityLevel}
- Objetivo: ${goalMap[goal]}

**Metas Nutricionais:**
- Calorias diárias: ${tdee} kcal
- Proteínas: ${macros.protein}g
- Carboidratos: ${macros.carbs}g
- Gorduras: ${macros.fat}g

${preferences.length > 0 ? `**Preferências alimentares:** ${preferences.join(', ')}` : ''}
${restrictions.length > 0 ? `**Restrições alimentares:** ${restrictions.join(', ')}` : ''}

**Requisitos do plano:**
1. Distribua as calorias em 5-6 refeições ao longo do dia
2. Use alimentos comuns e acessíveis no Brasil
3. Inclua horários específicos para cada refeição
4. Especifique porções em medidas caseiras (xícara, colher, unidade, etc)
5. Calcule os macronutrientes de forma precisa
6. Considere praticidade no preparo
7. Inclua variedade nutricional
8. Forneça dicas de preparo quando relevante

**Estrutura sugerida:**
- Café da manhã (7h00)
- Lanche da manhã (10h00)
- Almoço (12h30)
- Lanche da tarde (15h30)
- Jantar (19h00)
- Ceia (21h30) - opcional

Crie um plano equilibrado, prático e adequado ao objetivo de ${goalMap[goal]}.
`.trim()
}
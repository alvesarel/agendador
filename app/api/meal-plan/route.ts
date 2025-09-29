import { generateMealPlan, type MealPlanRequest } from '@/lib/meal-plan'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const body = await req.json() as MealPlanRequest

    // Validate required fields
    if (!body.userInput || !body.metrics) {
      return NextResponse.json(
        { error: 'Dados de usuário e métricas são obrigatórios' },
        { status: 400 }
      )
    }

    // Generate meal plan using GPT-5
    const mealPlan = await generateMealPlan(body)

    return NextResponse.json({
      success: true,
      mealPlan
    })
  } catch (error) {
    console.error('Meal plan API error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Erro ao gerar plano alimentar. Tente novamente.'
      },
      { status: 500 }
    )
  }
}
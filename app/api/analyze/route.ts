import { generateText } from 'ai'
import { visionModel, systemPrompts } from '@/lib/ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const weight = parseFloat(formData.get('weight') as string)
    const height = parseFloat(formData.get('height') as string)

    const currentPhotos = formData.getAll('currentPhotos') as File[]
    const goalPhotos = formData.getAll('goalPhotos') as File[]

    // Convert images to base64 for Gemini 2.5 Pro
    const currentImageData = await Promise.all(
      currentPhotos.map(async (file) => {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        return {
          type: 'image' as const,
          image: buffer.toString('base64'),
          mimeType: file.type
        }
      })
    )

    const goalImageData = await Promise.all(
      goalPhotos.map(async (file) => {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        return {
          type: 'image' as const,
          image: buffer.toString('base64'),
          mimeType: file.type
        }
      })
    )

    // Generate comprehensive analysis using Gemini 2.5 Pro vision
    const result = await generateText({
      model: visionModel,
      system: systemPrompts.vision,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analise detalhadamente estas imagens de composição corporal.

**Dados fornecidos:**
- Peso atual: ${weight}kg
- Altura: ${height}cm

**Fotos do físico atual:**
As primeiras ${currentPhotos.length} imagens mostram o físico atual da pessoa.

**Fotos do físico objetivo:**
As próximas ${goalPhotos.length} imagens mostram o físico que a pessoa deseja alcançar.

Por favor, forneça uma análise completa incluindo:
1. Avaliação da composição corporal atual (distribuição de gordura, massa muscular aparente, postura)
2. Comparação detalhada entre o físico atual e o físico objetivo
3. Identificação das principais diferenças e áreas que precisam de foco
4. Recomendações específicas e realistas para atingir o objetivo
5. Estimativa de tempo necessário e nível de esforço
6. Sugestões de próximos passos e se seria benéfico agendar uma consulta profissional

Seja empática, motivadora e profissional na sua análise.`
          },
          ...currentImageData,
          ...goalImageData
        ]
      }],
      maxOutputTokens: 2000,
      temperature: 0.7
    })

    return Response.json({
      analysis: result.text,
      weight,
      height,
      usage: result.usage
    })
  } catch (error) {
    console.error('Vision analysis error:', error)
    return new Response('Erro ao processar análise visual', { status: 500 })
  }
}
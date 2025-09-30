import { generateText } from 'ai'
import { visionModel, systemPrompts } from '@/lib/ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    console.log('[Analyze API] Starting image analysis...')
    const formData = await req.formData()

    const weight = parseFloat(formData.get('weight') as string)
    const height = parseFloat(formData.get('height') as string)

    const currentPhotos = formData.getAll('currentPhotos') as File[]
    const goalPhotos = formData.getAll('goalPhotos') as File[]

    console.log('[Analyze API] Received data:', {
      weight,
      height,
      currentPhotosCount: currentPhotos.length,
      goalPhotosCount: goalPhotos.length
    })

    // Convert images to Buffer format for Gemini 2.5 Pro
    console.log('[Analyze API] Converting current photos...')
    const currentImageData = await Promise.all(
      currentPhotos.map(async (file) => {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        return {
          type: 'file' as const,
          data: buffer,
          mimeType: file.type || 'image/jpeg'
        }
      })
    )

    console.log('[Analyze API] Converting goal photos...')
    const goalImageData = await Promise.all(
      goalPhotos.map(async (file) => {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        return {
          type: 'file' as const,
          data: buffer,
          mimeType: file.type || 'image/jpeg'
        }
      })
    )

    console.log('[Analyze API] Images converted successfully')

    // Generate comprehensive analysis using Gemini 2.5 Pro vision
    console.log('[Analyze API] Calling Gemini 2.5 Pro vision model...')
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

    console.log('[Analyze API] Analysis completed successfully')
    console.log('[Analyze API] Result object:', {
      hasText: !!result.text,
      textLength: result.text?.length,
      textPreview: result.text?.substring(0, 100),
      usage: result.usage,
      fullResult: result
    })

    if (!result.text || result.text.trim().length === 0) {
      console.error('[Analyze API] Empty response from AI model')
      console.error('[Analyze API] Full result:', JSON.stringify(result, null, 2))
      throw new Error('O modelo de IA retornou uma resposta vazia')
    }

    return Response.json({
      analysis: result.text,
      weight,
      height,
      usage: result.usage
    })
  } catch (error) {
    console.error('[Analyze API] ERROR:', error)
    console.error('[Analyze API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error?.constructor?.name
    })

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return Response.json(
      {
        error: 'Erro ao processar análise visual',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}
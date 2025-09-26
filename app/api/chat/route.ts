import { streamText } from 'ai'
import { chatModel, systemPrompts } from '@/lib/ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: chatModel,
      system: systemPrompts.chat,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Erro ao processar mensagem', { status: 500 })
  }
}
// Test script to verify AI Gateway configuration
import { generateText, createGateway } from 'ai'

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY || '',
  baseURL: 'https://ai-gateway.vercel.sh/v1/ai',
})

const testModel = gateway('google/gemini-2.5-flash')

async function testAIGateway() {
  try {
    console.log('Testing Vercel AI Gateway connection...')
    console.log('API Key (first 10 chars):', process.env.AI_GATEWAY_API_KEY?.substring(0, 10))

    const result = await generateText({
      model: testModel,
      prompt: 'Say hello in Portuguese',
      maxTokens: 50
    })

    console.log('✅ Success! Response:', result.text)
    console.log('Token usage:', result.usage)
  } catch (error) {
    console.error('❌ Error:', error)
    console.error('Error details:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack
    })
  }
}

testAIGateway()
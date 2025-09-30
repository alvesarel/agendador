'use client'

import { Chat } from '@/components/chat'
import { Header } from '@/components/header'
import { PrivacyNotice } from '@/components/privacy-notice'
import { UserIntake } from '@/components/user-intake'
import type { MealPlan } from '@/lib/meal-plan'
import { useChat } from '@ai-sdk/react'
import { useState } from 'react'

interface UserData {
  weight: number
  height: number
  analysis: string
}

export default function Home() {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const chat = useChat()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleIntakeSubmit = async (payload: {
    weight: number
    height: number
    currentPhotos: File[]
    goalPhotos: File[]
  }) => {
    setIsAnalyzing(true)
    console.log('[Frontend] Starting analysis with:', {
      weight: payload.weight,
      height: payload.height,
      currentPhotosCount: payload.currentPhotos.length,
      goalPhotosCount: payload.goalPhotos.length
    })

    try {
      // Create FormData for image upload
      const formData = new FormData()
      formData.append('weight', payload.weight.toString())
      formData.append('height', payload.height.toString())

      payload.currentPhotos.forEach((file) => {
        formData.append('currentPhotos', file)
      })

      payload.goalPhotos.forEach((file) => {
        formData.append('goalPhotos', file)
      })

      console.log('[Frontend] Sending request to /api/analyze...')

      // Call vision analysis API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      console.log('[Frontend] Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[Frontend] API error response:', errorData)
        throw new Error(errorData.details || 'Falha na análise visual')
      }

      const data = await response.json()
      console.log('[Frontend] Full response data:', JSON.stringify(data, null, 2))
      console.log('[Frontend] Analysis field:', {
        exists: 'analysis' in data,
        type: typeof data.analysis,
        value: data.analysis
      })

      if (!data.analysis || typeof data.analysis !== 'string' || data.analysis.trim().length === 0) {
        console.error('[Frontend] Invalid analysis data - full response:', JSON.stringify(data, null, 2))
        throw new Error('Resposta da API não contém análise válida')
      }

      console.log('[Frontend] Valid analysis received, length:', data.analysis.length)

      // Send analysis to chat FIRST
      const message = buildAnalysisMessage(payload.weight, payload.height, data.analysis)
      console.log('[Frontend] Sending message to chat...')
      await chat.sendMessage(message as any)

      // Only set userData after message is sent successfully
      console.log('[Frontend] Setting user data...')
      setUserData({
        weight: payload.weight,
        height: payload.height,
        analysis: data.analysis
      })

      console.log('[Frontend] Analysis flow completed successfully')
    } catch (error) {
      console.error('[Frontend] Error analyzing photos:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`Erro ao analisar imagens: ${errorMessage}\n\nPor favor, verifique o console do navegador para mais detalhes e tente novamente.`)
      // Don't set userData on error to stay on intake form
      setIsAnalyzing(false)
      return
    }

    setIsAnalyzing(false)
  }

  const handleMealPlanRequest = async () => {
    if (!userData) {
      alert('Por favor, complete a análise visual primeiro.')
      return
    }

    setIsGeneratingMealPlan(true)

    try {
      const response = await fetch('/api/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: {
            weight: userData.weight,
            height: userData.height,
            age: 35, // Default values - can be collected later if needed
            gender: 'female',
            activityLevel: 'moderate',
            goal: 'cutting'
          },
          metrics: {
            bmr: 1400,
            tdee: 2000,
            macros: { protein: 150, carbs: 150, fat: 60 }
          },
          preferences: [],
          restrictions: []
        })
      })

      if (!response.ok) {
        throw new Error('Falha ao gerar plano alimentar')
      }

      const data = await response.json()
      setMealPlan(data.mealPlan)
    } catch (error) {
      console.error('Error requesting meal plan:', error)
      alert('Erro ao gerar plano alimentar. Tente novamente.')
    } finally {
      setIsGeneratingMealPlan(false)
    }
  }

  if (!acceptedPrivacy) {
    return <PrivacyNotice onAccept={() => setAcceptedPrivacy(true)} />
  }

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {!userData && !isAnalyzing && (
          <div className="w-full max-w-2xl mx-auto">
            <UserIntake onSubmit={handleIntakeSubmit} />
          </div>
        )}

        {isAnalyzing && (
          <div className="flex items-center justify-center min-h-full">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center max-w-md">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analisando suas imagens...
              </h3>
              <p className="text-sm text-gray-600">
                Estamos usando IA avançada para comparar seu físico atual com seu objetivo e criar uma análise personalizada.
              </p>
            </div>
          </div>
        )}

        {userData && !isAnalyzing && (
          <div className="w-full h-full max-w-6xl mx-auto flex flex-col">
            <Chat
              chat={chat as any}
              mealPlan={mealPlan}
              onRequestMealPlan={handleMealPlanRequest}
              isGeneratingMealPlan={isGeneratingMealPlan}
              hasUserData={!!userData}
            />
          </div>
        )}
      </div>
    </main>
  )
}

function buildAnalysisMessage(weight: number, height: number, analysis: string) {
  return [
    'Análise Visual Completa',
    '',
    `**Dados fornecidos:**`,
    `- Peso: ${weight}kg`,
    `- Altura: ${height}cm`,
    '',
    `**Análise da IA:**`,
    analysis,
    '',
    'Estou aqui para responder qualquer dúvida sobre sua análise e ajudar você a alcançar seus objetivos!'
  ].join('\n')
}

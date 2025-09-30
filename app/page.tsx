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

      // Call vision analysis API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Falha na análise visual')
      }

      const data = await response.json()

      setUserData({
        weight: payload.weight,
        height: payload.height,
        analysis: data.analysis
      })

      // Send analysis to chat
      const message = buildAnalysisMessage(payload.weight, payload.height, data.analysis)
      chat.sendMessage(message as any)
    } catch (error) {
      console.error('Error analyzing photos:', error)
      alert('Erro ao analisar imagens. Tente novamente.')
    } finally {
      setIsAnalyzing(false)
    }
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
    <main className="flex-1 flex flex-col bg-gray-50">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row">
        {!userData && !isAnalyzing && (
          <div className="w-full lg:w-[360px] lg:shrink-0">
            <UserIntake onSubmit={handleIntakeSubmit} />
          </div>
        )}

        {isAnalyzing && (
          <div className="flex-1 flex items-center justify-center min-h-[520px]">
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
          <div className="flex-1 min-h-[520px]">
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

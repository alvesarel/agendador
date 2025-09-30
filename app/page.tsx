'use client'

import { Chat } from '@/components/chat'
import { Header } from '@/components/header'
import { MetricsSummary } from '@/components/metrics-summary'
import { PrivacyNotice } from '@/components/privacy-notice'
import { UserIntake } from '@/components/user-intake'
import type { MetricsResult, UserMetricsInput } from '@/lib/calculations'
import type { MealPlan } from '@/lib/meal-plan'
import { useChat } from '@ai-sdk/react'
import { useState } from 'react'

export default function Home() {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const chat = useChat()
  const [metrics, setMetrics] = useState<MetricsResult | null>(null)
  const [userInput, setUserInput] = useState<UserMetricsInput | null>(null)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false)

  const handleIntakeSubmit = (payload: {
    input: UserMetricsInput
    summary: MetricsResult
  }) => {
    setUserInput(payload.input)
    setMetrics(payload.summary)

    const message = buildIntakeMessage(payload.input, payload.summary)
    chat.append({ role: 'user', content: message })
  }

  const handleMealPlanRequest = async () => {
    if (!userInput || !metrics) {
      alert('Por favor, preencha seus dados pessoais primeiro.')
      return
    }

    setIsGeneratingMealPlan(true)

    try {
      const response = await fetch('/api/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput,
          metrics,
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
        <div className="w-full lg:w-[360px] lg:shrink-0">
          <UserIntake onSubmit={handleIntakeSubmit} />
          {metrics && userInput && (
            <MetricsSummary input={userInput} summary={metrics} />
          )}
        </div>

        <div className="flex-1 min-h-[520px]">
          <Chat
            chat={chat}
            mealPlan={mealPlan}
            onRequestMealPlan={handleMealPlanRequest}
            isGeneratingMealPlan={isGeneratingMealPlan}
            hasUserData={!!userInput && !!metrics}
          />
        </div>
      </div>
    </main>
  )
}

function buildIntakeMessage(input: UserMetricsInput, summary: MetricsResult) {
  return [
    'Aqui estão meus dados para personalizar o acompanhamento:',
    `- Idade: ${input.age} anos`,
    `- Sexo: ${input.gender === 'female' ? 'feminino' : 'masculino'}`,
    `- Altura: ${input.height} cm`,
    `- Peso: ${input.weight} kg`,
    `- Nível de atividade: ${input.activityLevel}`,
    `- Objetivo: ${goalLabel(input.goal)}`,
    '',
    'Resultados calculados:',
    `- TMB estimada: ${summary.bmr} kcal`,
    `- Calorias diárias recomendadas para o objetivo: ${summary.tdee} kcal`,
    `- Distribuição de macros (g/dia): ${summary.macros.protein} proteínas / ${summary.macros.carbs} carboidratos / ${summary.macros.fat} gorduras`,
    '',
    'Com base nisso, gostaria de receber uma análise corporal e sugestões personalizadas.'
  ].join('\n')
}

function goalLabel(goal: UserMetricsInput['goal']) {
  switch (goal) {
    case 'cutting':
      return 'definição'
    case 'bulking':
      return 'hipertrofia'
    default:
      return 'manutenção'
  }
}

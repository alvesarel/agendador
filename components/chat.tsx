'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { Send, Loader2, Camera, Utensils } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CTA } from './cta'
import { MealPlanDisplay } from './meal-plan-display'
import type { MealPlan } from '@/lib/meal-plan'

interface ChatProps {
  chat: UseChatHelpers<any>
  mealPlan: MealPlan | null
  onRequestMealPlan: () => void
  isGeneratingMealPlan: boolean
  hasUserData: boolean
}

export function Chat({
  chat,
  mealPlan,
  onRequestMealPlan,
  isGeneratingMealPlan,
  hasUserData
}: ChatProps) {
  const { messages, sendMessage, status } = chat
  const [input, setInput] = useState('')
  const isLoading = status === 'submitted' || status === 'streaming'

  // Helper to safely get message content
  const getMessageContent = (message: any): string => {
    if (typeof message.content === 'string') return message.content
    if (Array.isArray(message.content)) {
      return message.content
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join(' ')
    }
    return ''
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input as any)
    setInput('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const [showCTA, setShowCTA] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (messages.length > 5) {
      setShowCTA(true)
    }
  }, [messages.length])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // TODO: Implement image upload logic
    console.log('Images selected:', files)
  }

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Olá! Vamos começar sua análise corporal?
            </h2>
            <p className="text-gray-600">
              Me conte sobre seus objetivos e eu vou te ajudar a alcançá-los.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{getMessageContent(message)}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          </div>
        )}

        {showCTA && <CTA />}

        {/* Meal Plan Display */}
        {mealPlan && <MealPlanDisplay mealPlan={mealPlan} />}

        {/* Meal Plan Generation Loading */}
        {isGeneratingMealPlan && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">
                  Gerando seu plano alimentar personalizado...
                </h3>
                <p className="text-sm text-green-700">
                  Estamos criando um plano adaptado aos seus objetivos e necessidades.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-4 shrink-0"
      >
        {/* Meal Plan Request Button */}
        {hasUserData && !mealPlan && messages.length >= 2 && (
          <div className="mb-3">
            <button
              type="button"
              onClick={onRequestMealPlan}
              disabled={isGeneratingMealPlan}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Utensils className="w-5 h-5" />
              {isGeneratingMealPlan ? 'Gerando plano alimentar...' : 'Gerar Plano Alimentar Personalizado'}
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Enviar fotos"
          >
            <Camera className="w-5 h-5" />
          </button>

          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
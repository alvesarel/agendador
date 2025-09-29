'use client'

import { Clock, Utensils, Info } from 'lucide-react'
import type { MealPlan } from '@/lib/meal-plan'

interface MealPlanDisplayProps {
  mealPlan: MealPlan
}

export function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {
  return (
    <div className="space-y-4 my-4">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
          <Utensils className="w-5 h-5" />
          Seu Plano Alimentar Personalizado
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-gray-600 text-xs">Calorias</p>
            <p className="text-xl font-bold text-green-700">{mealPlan.totalCalories}</p>
            <p className="text-gray-500 text-xs">kcal/dia</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-gray-600 text-xs">Proteínas</p>
            <p className="text-xl font-bold text-blue-700">{mealPlan.macros.protein}g</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-gray-600 text-xs">Carboidratos</p>
            <p className="text-xl font-bold text-orange-700">{mealPlan.macros.carbs}g</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-gray-600 text-xs">Gorduras</p>
            <p className="text-xl font-bold text-yellow-700">{mealPlan.macros.fat}g</p>
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        {mealPlan.meals.map((meal, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-gray-900">{meal.name}</h4>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{meal.time}</p>
                <p className="text-sm font-medium text-gray-700">{meal.calories} kcal</p>
              </div>
            </div>

            <div className="space-y-2">
              {meal.foods.map((food, foodIndex) => (
                <div
                  key={foodIndex}
                  className="flex items-start justify-between text-sm py-1 border-l-2 border-gray-200 pl-3"
                >
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium">{food.item}</span>
                    <span className="text-gray-600 ml-2">- {food.quantity}</span>
                  </div>
                  <span className="text-gray-500 text-xs ml-2">{food.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {mealPlan.notes && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Dicas Importantes</h4>
              <p className="text-sm text-blue-800 whitespace-pre-line">{mealPlan.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Imprimir Plano
        </button>
        <a
          href={process.env.NEXT_PUBLIC_CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
        >
          Agendar Consulta
        </a>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { ACTIVITY_LEVELS, ActivityLevel, UserMetricsInput, computeMetrics, type MetricsResult } from '@/lib/calculations'

interface UserIntakeProps {
  onSubmit: (payload: {
    input: UserMetricsInput
    summary: MetricsResult
  }) => void
}

const DEFAULT_STATE: UserMetricsInput = {
  age: 38,
  height: 165,
  weight: 68,
  gender: 'female',
  activityLevel: 'light',
  goal: 'cutting'
}

export function UserIntake({ onSubmit }: UserIntakeProps) {
  const [form, setForm] = useState<UserMetricsInput>(DEFAULT_STATE)
  const [error, setError] = useState<string | null>(null)

  const handleChange = <K extends keyof UserMetricsInput>(key: K, value: UserMetricsInput[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const validate = () => {
    if (form.age < 18 || form.age > 80) {
      return 'Informe uma idade válida entre 18 e 80 anos.'
    }
    if (form.weight < 35 || form.weight > 180) {
      return 'Informe um peso entre 35kg e 180kg.'
    }
    if (form.height < 140 || form.height > 200) {
      return 'Informe uma altura entre 140cm e 200cm.'
    }
    return null
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    const summary = computeMetrics(form)
    onSubmit({ input: form, summary })
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Dados pessoais</h2>
        <p className="text-sm text-gray-600">
          Informe seus dados para personalizar os cálculos de metabolismo e plano alimentar.
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Idade"
            suffix="anos"
            type="number"
            value={form.age}
            onChange={(value) => handleChange('age', Number(value))}
            min={18}
            max={80}
          />

          <InputField
            label="Peso"
            suffix="kg"
            type="number"
            value={form.weight}
            onChange={(value) => handleChange('weight', Number(value))}
            step={0.5}
            min={35}
            max={180}
          />

          <InputField
            label="Altura"
            suffix="cm"
            type="number"
            value={form.height}
            onChange={(value) => handleChange('height', Number(value))}
            min={140}
            max={200}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sexo</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Feminino', value: 'female' },
                { label: 'Masculino', value: 'male' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('gender', option.value as UserMetricsInput['gender'])}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    form.gender === option.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Objetivo</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Definição', value: 'cutting' },
                { label: 'Manutenção', value: 'maintenance' },
                { label: 'Hipertrofia', value: 'bulking' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('goal', option.value as UserMetricsInput['goal'])}
                  className={`rounded-lg border px-2 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    form.goal === option.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nível de atividade</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(ACTIVITY_LEVELS) as ActivityLevel[]).map((level) => {
              const option = ACTIVITY_LEVELS[level]
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleChange('activityLevel', level)}
                  className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                    form.activityLevel === level
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="block text-sm font-semibold">
                    {option.title}
                  </span>
                  <span className="block text-xs text-gray-600">
                    {option.description}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Calcular metabolismo
        </button>
      </form>
    </section>
  )
}

interface InputFieldProps {
  label: string
  suffix?: string
  type?: 'number'
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

function InputField({ label, suffix, value, onChange, min, max, step = 1 }: InputFieldProps) {
  return (
    <label className="space-y-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {suffix && (
          <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </label>
  )
}

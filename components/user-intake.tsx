'use client'

import { useState } from 'react'
import { Camera, X } from 'lucide-react'

interface UserIntakeProps {
  onSubmit: (payload: {
    weight: number
    height: number
    currentPhotos: File[]
    goalPhotos: File[]
  }) => void
}

interface FormState {
  weight: string
  height: string
  currentPhotos: File[]
  goalPhotos: File[]
}

const DEFAULT_STATE: FormState = {
  weight: '',
  height: '',
  currentPhotos: [],
  goalPhotos: []
}

export function UserIntake({ onSubmit }: UserIntakeProps) {
  const [form, setForm] = useState<FormState>(DEFAULT_STATE)
  const [error, setError] = useState<string | null>(null)

  const handlePhotoUpload = (type: 'current' | 'goal', files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'))

    if (type === 'current') {
      setForm(prev => ({ ...prev, currentPhotos: [...prev.currentPhotos, ...fileArray] }))
    } else {
      setForm(prev => ({ ...prev, goalPhotos: [...prev.goalPhotos, ...fileArray] }))
    }
  }

  const removePhoto = (type: 'current' | 'goal', index: number) => {
    if (type === 'current') {
      setForm(prev => ({
        ...prev,
        currentPhotos: prev.currentPhotos.filter((_, i) => i !== index)
      }))
    } else {
      setForm(prev => ({
        ...prev,
        goalPhotos: prev.goalPhotos.filter((_, i) => i !== index)
      }))
    }
  }

  const validate = () => {
    const weight = parseFloat(form.weight)
    const height = parseFloat(form.height)

    if (!form.weight || isNaN(weight) || weight < 35 || weight > 180) {
      return 'Informe um peso válido entre 35kg e 180kg.'
    }
    if (!form.height || isNaN(height) || height < 140 || height > 200) {
      return 'Informe uma altura válida entre 140cm e 200cm.'
    }
    if (form.currentPhotos.length === 0) {
      return 'Por favor, envie pelo menos uma foto do seu físico atual.'
    }
    if (form.goalPhotos.length === 0) {
      return 'Por favor, envie pelo menos uma foto do seu físico objetivo.'
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
    onSubmit({
      weight: parseFloat(form.weight),
      height: parseFloat(form.height),
      currentPhotos: form.currentPhotos,
      goalPhotos: form.goalPhotos
    })
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6 mb-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Comece sua análise</h2>
        <p className="text-sm text-gray-600">
          Informe seu peso, altura e envie fotos do seu físico atual e objetivo.
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Weight and Height */}
        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Peso</span>
            <div className="relative">
              <input
                type="number"
                value={form.weight}
                min={35}
                max={180}
                step={0.5}
                onChange={(e) => setForm(prev => ({ ...prev, weight: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="68"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                kg
              </span>
            </div>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Altura</span>
            <div className="relative">
              <input
                type="number"
                value={form.height}
                min={140}
                max={200}
                onChange={(e) => setForm(prev => ({ ...prev, height: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="165"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                cm
              </span>
            </div>
          </label>
        </div>

        {/* Current Physique Photos */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Seu físico atual</label>
          <p className="text-xs text-gray-500">Envie fotos de frente, costas e lateral</p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handlePhotoUpload('current', e.target.files)}
            className="hidden"
            id="current-photos"
          />

          <label
            htmlFor="current-photos"
            className="flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
          >
            <Camera className="w-5 h-5" />
            Enviar fotos atuais
          </label>

          {form.currentPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {form.currentPhotos.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Foto atual ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto('current', index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goal Physique Photos */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Seu físico objetivo</label>
          <p className="text-xs text-gray-500">Envie fotos de referência do corpo que deseja alcançar</p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handlePhotoUpload('goal', e.target.files)}
            className="hidden"
            id="goal-photos"
          />

          <label
            htmlFor="goal-photos"
            className="flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
          >
            <Camera className="w-5 h-5" />
            Enviar fotos objetivo
          </label>

          {form.goalPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {form.goalPhotos.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Foto objetivo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto('goal', index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Iniciar análise visual
        </button>
      </form>
    </section>
  )
}


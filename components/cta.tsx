'use client'

import { Calendar, Star, Clock, TrendingUp } from 'lucide-react'

export function CTA() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '#'

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <Star className="w-6 h-6 text-yellow-400 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold mb-2">
            Quer resultados mais rápidos?
          </h3>
          <p className="text-blue-100">
            Você está no caminho certo! Com acompanhamento profissional, seus resultados podem ser até 3x mais rápidos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-200" />
          <span className="text-sm">Plano 100% personalizado</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-200" />
          <span className="text-sm">Resultados em 30 dias</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-blue-200" />
          <span className="text-sm">Acompanhamento semanal</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-white text-blue-600 py-3 px-6 rounded-lg font-bold hover:bg-blue-50 transition-colors"
        >
          <Calendar className="w-5 h-5" />
          Agendar Consulta Gratuita
        </a>
        <button className="text-blue-100 hover:text-white transition-colors py-3 px-6">
          Talvez mais tarde
        </button>
      </div>

      <p className="text-xs text-blue-200 mt-4">
        * Vagas limitadas. Oferta especial para os próximos 10 agendamentos.
      </p>
    </div>
  )
}
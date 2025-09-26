'use client'

import { Activity, Calendar } from 'lucide-react'

export function Header() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '#'

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">
            Analisador Corporal IA
          </h1>
          <span className="hidden sm:inline text-sm text-gray-500">
            por Dr. Guilherme Leitner
          </span>
        </div>

        <a
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Agendar Consulta</span>
          <span className="sm:hidden">Agendar</span>
        </a>
      </div>
    </header>
  )
}
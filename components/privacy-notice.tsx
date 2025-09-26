'use client'

import { Shield, Check } from 'lucide-react'

interface PrivacyNoticeProps {
  onAccept: () => void
}

export function PrivacyNotice({ onAccept }: PrivacyNoticeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Aviso de Privacidade
          </h1>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-gray-700">
            Bem-vindo ao <strong>Analisador Corporal IA</strong>. Sua privacidade é nossa prioridade.
          </p>

          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="font-semibold text-blue-900 mb-2">
              Como protegemos seus dados:
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Não armazenamos suas informações pessoais
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Suas fotos são processadas em tempo real e não são salvas
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Não utilizamos cookies de rastreamento
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Cumprimos integralmente a LGPD
                </span>
              </li>
            </ul>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              Este serviço utiliza inteligência artificial para fornecer análises e recomendações nutricionais personalizadas.
            </p>
            <p>
              <strong>Importante:</strong> As análises fornecidas são para fins informativos.
              Para um acompanhamento completo, consulte Dr. Guilherme Leitner.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onAccept}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Concordo e quero continuar
          </button>
          <a
            href="https://www.gov.br/lgpd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
          >
            Saber mais sobre LGPD
          </a>
        </div>
      </div>
    </div>
  )
}
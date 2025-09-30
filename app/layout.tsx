import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Analisador Corporal IA - Dr. Guilherme Leitner',
  description: 'Análise corporal personalizada com inteligência artificial. Receba seu plano alimentar e acompanhamento profissional.',
  keywords: 'análise corporal, nutrição, emagrecimento, saúde, Dr. Guilherme Leitner',
  authors: [{ name: 'Dr. Guilherme Leitner' }],
  openGraph: {
    title: 'Analisador Corporal IA',
    description: 'Transforme seu corpo com análise profissional gratuita',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full`}>
        {children}
      </body>
    </html>
  )
}
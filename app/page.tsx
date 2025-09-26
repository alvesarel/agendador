'use client'

import { Chat } from '@/components/chat'
import { Header } from '@/components/header'
import { PrivacyNotice } from '@/components/privacy-notice'
import { useState } from 'react'

export default function Home() {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)

  if (!acceptedPrivacy) {
    return <PrivacyNotice onAccept={() => setAcceptedPrivacy(true)} />
  }

  return (
    <main className="flex-1 flex flex-col">
      <Header />
      <Chat />
    </main>
  )
}
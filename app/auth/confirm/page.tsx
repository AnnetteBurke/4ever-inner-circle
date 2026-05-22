'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function AuthConfirmPage() {
  const router = useRouter()
  const [debug, setDebug] = useState('')

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const search = window.location.search
    const hash = window.location.hash
    const params = new URLSearchParams(search)
    const code = params.get('code')
    const token_hash = params.get('token_hash')
    const type = params.get('type')

    setDebug(`search: ${search} | hash: ${hash} | code: ${code} | token_hash: ${token_hash} | type: ${type}`)

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        router.replace(error ? '/login' : '/home')
      })
      return
    }

    if (token_hash && type) {
      supabase.auth.verifyOtp({ token_hash, type: type as any }).then(({ error }) => {
        router.replace(error ? '/login' : '/home')
      })
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace('/home')
      }
    })

    const timeout = setTimeout(() => router.replace('/login'), 8000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center max-w-2xl px-8">
        <p className="font-serif italic text-2xl text-plum mb-6">Opening your Inner Circle...</p>
        <p className="text-xs text-whisper break-all">{debug}</p>
      </div>
    </main>
  )
}

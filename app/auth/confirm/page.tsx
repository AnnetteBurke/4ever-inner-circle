'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function AuthConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    // Handle PKCE code in URL (server-side invite flow)
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        router.replace(error ? '/login' : '/home')
      })
      return
    }

    // Handle hash-based tokens (implicit invite flow)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace('/home')
      } else if (event === 'INITIAL_SESSION') {
        router.replace('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif italic text-2xl text-plum">Opening your Inner Circle...</p>
      </div>
    </main>
  )
}

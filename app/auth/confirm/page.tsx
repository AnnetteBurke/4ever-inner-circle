'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function AuthConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    // Handle PKCE code in URL search params
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        router.replace(error ? '/login' : '/home')
      })
      return
    }

    // Listen for SIGNED_IN from hash-based tokens
    // Don't act on INITIAL_SESSION — wait for the session to be fully established
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace('/home')
      }
    })

    // Fallback: if nothing happens after 5 seconds, go to login
    const timeout = setTimeout(() => {
      router.replace('/login')
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif italic text-2xl text-plum">Opening your Inner Circle...</p>
      </div>
    </main>
  )
}

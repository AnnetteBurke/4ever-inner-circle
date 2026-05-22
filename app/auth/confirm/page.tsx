'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function AuthConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    // Tokens arrive in the URL hash for invite flow
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const access_token = hashParams.get('access_token')
    const refresh_token = hashParams.get('refresh_token')

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        router.replace(error ? '/login' : '/home')
      })
      return
    }

    // Fallback: PKCE code in query string
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        router.replace(error ? '/login' : '/home')
      })
      return
    }

    router.replace('/login')
  }, [router])

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif italic text-2xl text-plum">Opening your Inner Circle...</p>
      </div>
    </main>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function AuthConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/home')
      } else {
        router.replace('/login')
      }
    })
  }, [router])

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif italic text-2xl text-plum">Opening your Inner Circle...</p>
      </div>
    </main>
  )
}

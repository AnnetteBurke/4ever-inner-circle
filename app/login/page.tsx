'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser' // still needed for session check

const inputClass = 'w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/home')
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-lg px-8">
          <div className="text-[11px] tracking-label uppercase text-mauve mb-6">4Ever Inner Circle</div>
          <h1 className="text-4xl font-light text-ink mb-4 leading-tight">Check your inbox</h1>
          <p className="font-serif italic text-xl text-plum mb-8">Your link is on its way</p>
          <p className="text-base text-whisper leading-relaxed">
            We have sent a sign-in link to <span className="text-ink">{email}</span>.
            Click it and you will be straight back into your Inner Circle.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="max-w-md w-full px-8">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-6 text-center">4Ever Inner Circle</div>
        <h1 className="text-4xl font-light text-ink mb-2 leading-tight text-center">Welcome back</h1>
        <p className="font-serif italic text-xl text-plum mb-10 text-center">Enter your email to sign in</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send me a link'}
          </button>
        </form>

        <p className="text-sm text-whisper mt-6 text-center leading-relaxed">
          No password needed. We will send a link straight to your inbox.
        </p>
      </div>
    </main>
  )
}

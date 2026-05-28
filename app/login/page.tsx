'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

const inputClass = 'w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/home')
    })
  }, [router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email or password not recognised. Please try again.')
      setLoading(false)
      return
    }
    router.replace('/home')
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setResetLoading(true)
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth/set-password`,
    })
    setResetSent(true)
    setResetLoading(false)
  }

  if (resetSent) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-lg px-8">
          <div className="text-[11px] tracking-label uppercase text-mauve mb-6">4Ever Inner Circle</div>
          <h1 className="text-4xl font-light text-ink mb-4 leading-tight">Check your inbox</h1>
          <p className="font-serif italic text-xl text-plum mb-8">Your reset link is on its way</p>
          <p className="text-base text-whisper leading-relaxed mb-8">
            We have sent a password reset link to <span className="text-ink">{resetEmail}</span>.
            Click it and you will be able to set a new password straight away.
          </p>
          <button
            onClick={() => { setShowReset(false); setResetSent(false); setResetEmail('') }}
            className="text-sm text-whisper underline hover:text-mauve transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </main>
    )
  }

  if (showReset) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="max-w-md w-full px-8">
          <div className="text-[11px] tracking-label uppercase text-mauve mb-6 text-center">4Ever Inner Circle</div>
          <h1 className="text-4xl font-light text-ink mb-2 leading-tight text-center">Forgot your password?</h1>
          <p className="font-serif italic text-xl text-plum mb-10 text-center">
            Enter your email and we will send a reset link
          </p>

          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              required
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              placeholder="your@email.com"
              className={inputClass}
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={resetLoading}
              className="w-full py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-50"
            >
              {resetLoading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <button
            onClick={() => setShowReset(false)}
            className="block text-sm text-whisper underline hover:text-mauve transition-colors mt-6 mx-auto"
          >
            Back to sign in
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="max-w-md w-full px-8">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-6 text-center">4Ever Inner Circle</div>
        <h1 className="text-4xl font-light text-ink mb-2 leading-tight text-center">Welcome back</h1>
        <p className="font-serif italic text-xl text-plum mb-3 text-center">Sign in to your Inner Circle</p>
        <p className="text-[11px] tracking-label uppercase text-whisper text-center mb-10">Exclusively for 4Ever Photos couples</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={inputClass}
            autoComplete="email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className={inputClass}
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <button
          onClick={() => { setShowReset(true); setResetEmail(email) }}
          className="block text-sm text-whisper underline hover:text-mauve transition-colors mt-6 mx-auto text-center w-full"
        >
          Forgot your password?
        </button>
      </div>
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

const inputClass = 'w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve'

export default function SetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [expired, setExpired] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Resend state
  const [resendEmail, setResendEmail] = useState('')
  const [resending, setResending] = useState(false)
  const [resendDone, setResendDone] = useState(false)
  const [resendError, setResendError] = useState('')

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    async function handleTokens() {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const access_token = hashParams.get('access_token')
      const refresh_token = hashParams.get('refresh_token')

      if (access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
        if (error) {
          const msg = error.message.toLowerCase()
          if (msg.includes('expired') || msg.includes('invalid')) { setExpired(true) } else { setInvalid(true) }
          return
        }
        if (data.user?.user_metadata?.password_set) { router.replace('/login'); return }
        setReady(true)
        return
      }

      const code = new URLSearchParams(window.location.search).get('code')
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          const msg = error.message.toLowerCase()
          if (msg.includes('expired') || msg.includes('invalid')) { setExpired(true) } else { setInvalid(true) }
          return
        }
        if (data.user?.user_metadata?.password_set) { router.replace('/login'); return }
        setReady(true)
        return
      }

      // No tokens in URL — check if already logged in (navigated here directly)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) { setReady(true); return }

      setExpired(true)
    }

    handleTokens()
  }, [router])

  async function handleResend(e: React.FormEvent) {
    e.preventDefault()
    if (!resendEmail) return
    setResending(true)
    setResendError('')
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.resetPasswordForEmail(resendEmail, {
      redirectTo: `${window.location.origin}/auth/set-password`,
    })
    setResending(false)
    if (error) { setResendError('We could not find that email address. Please check and try again.'); return }
    setResendDone(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Please use at least 8 characters.'); return }

    setSaving(true)
    setError('')
    const supabase = createSupabaseBrowserClient()

    const { error } = await supabase.auth.updateUser({
      password,
      data: { password_set: true },
    })

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    await fetch('/api/auth/on-password-set', { method: 'POST' }).catch(() => {})
    router.replace('/home')
  }

  if (expired) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="max-w-md w-full px-8">
          <div className="text-[11px] tracking-label uppercase text-mauve mb-6 text-center">4Ever Inner Circle</div>
          <h1 className="text-4xl font-light text-ink mb-4 text-center">Your link has expired</h1>
          <p className="text-base text-whisper mb-10 leading-relaxed text-center">
            No problem at all. Enter your email below and we will send you a fresh link straight away.
          </p>

          {resendDone ? (
            <div className="text-center">
              <p className="text-base text-ink mb-2">Check your inbox.</p>
              <p className="text-sm text-whisper leading-relaxed">
                A new link is on its way to you now. Click it and you will be straight in.
              </p>
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Your email address</label>
                <input
                  type="email"
                  required
                  value={resendEmail}
                  onChange={e => setResendEmail(e.target.value)}
                  placeholder="The email your invitation was sent to"
                  className={inputClass}
                  autoComplete="email"
                />
              </div>
              {resendError && <p className="text-sm text-red-500">{resendError}</p>}
              <button
                type="submit"
                disabled={resending}
                className="w-full py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Send me a new link'}
              </button>
            </form>
          )}
        </div>
      </main>
    )
  }

  if (invalid) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="max-w-md w-full px-8 text-center">
          <div className="text-[11px] tracking-label uppercase text-mauve mb-6">4Ever Inner Circle</div>
          <h1 className="text-4xl font-light text-ink mb-4">Something went wrong</h1>
          <p className="text-base text-whisper mb-8 leading-relaxed">
            Please contact Annette at studio@4ever.photos and she will get you a fresh link.
          </p>
          <a
            href="/login"
            className="inline-block text-[11px] tracking-label uppercase border border-plum text-plum px-8 py-3 hover:bg-plum hover:text-cream transition-colors"
          >
            Back to sign in
          </a>
        </div>
      </main>
    )
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-serif italic text-2xl text-plum">Opening your Inner Circle...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="max-w-md w-full px-8">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-6 text-center">4Ever Inner Circle</div>
        <h1 className="text-4xl font-light text-ink mb-2 leading-tight text-center">Set your password</h1>
        <p className="font-serif italic text-xl text-plum mb-10 text-center">
          Choose something you will remember
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">New password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={inputClass}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Confirm password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Same again"
              className={inputClass}
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-50"
          >
            {saving ? 'Setting up...' : 'Set password and open my Inner Circle'}
          </button>
        </form>

        <p className="text-sm text-whisper mt-6 text-center leading-relaxed">
          You will use this email and password to sign in from now on.
        </p>
      </div>
    </main>
  )
}

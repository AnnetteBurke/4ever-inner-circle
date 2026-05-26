'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

const inputClass = 'w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve'

export default function SetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    async function handleTokens() {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const access_token = hashParams.get('access_token')
      const refresh_token = hashParams.get('refresh_token')

      if (access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
        if (error) { setInvalid(true); return }
        // Already set their password — send straight to login
        if (data.user?.user_metadata?.password_set) {
          router.replace('/login')
          return
        }
        setReady(true)
        return
      }

      const code = new URLSearchParams(window.location.search).get('code')
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) { setInvalid(true); return }
        if (data.user?.user_metadata?.password_set) {
          router.replace('/login')
          return
        }
        setReady(true)
        return
      }

      // No tokens in URL — check if already logged in (navigated here directly)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) { setReady(true); return }

      setInvalid(true)
    }

    handleTokens()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Please use at least 8 characters.'); return }

    setSaving(true)
    setError('')
    const supabase = createSupabaseBrowserClient()

    // Set the password and mark as set in metadata so second invite-link clicks go to login
    const { error } = await supabase.auth.updateUser({
      password,
      data: { password_set: true },
    })

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    // Send confirmation email and WhatsApp
    await fetch('/api/auth/on-password-set', { method: 'POST' }).catch(() => {})

    router.replace('/home')
  }

  if (invalid) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="max-w-md w-full px-8 text-center">
          <div className="text-[11px] tracking-label uppercase text-mauve mb-6">4Ever Inner Circle</div>
          <h1 className="text-4xl font-light text-ink mb-4">This link has expired</h1>
          <p className="text-base text-whisper mb-8 leading-relaxed">
            Head to the sign-in page and use &ldquo;Forgot your password?&rdquo; to get a fresh link.
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

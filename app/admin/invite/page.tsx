'use client'

import { useState } from 'react'

export default function InvitePage() {
  const [email, setEmail] = useState('')
  const [brideName, setBrideName] = useState('')
  const [groomName, setGroomName] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, brideName, groomName }),
    })

    setStatus(res.ok ? 'sent' : 'error')
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="max-w-md w-full px-8">
        <div className="label-tag mb-6">Admin</div>
        <h1 className="text-4xl font-light text-ink mb-2">Invite a couple</h1>
        <p className="text-base text-whisper mb-10">
          They will receive a magic link straight to their inbox.
        </p>

        {status === 'sent' ? (
          <div className="text-center py-12 border border-hairline">
            <p className="font-serif italic text-2xl text-plum mb-3">Invitation sent</p>
            <p className="text-sm text-whisper">
              {brideName} and {groomName} will receive their link shortly.
            </p>
            <button
              onClick={() => { setStatus('idle'); setEmail(''); setBrideName(''); setGroomName('') }}
              className="mt-8 text-[11px] tracking-label uppercase text-mauve border border-mauve px-8 py-3 hover:bg-mauve hover:text-cream transition-colors"
            >
              Invite another couple
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[11px] tracking-label uppercase text-mauve block mb-2">
                Bride or Partner 1 first name
              </label>
              <input
                type="text"
                required
                value={brideName}
                onChange={e => setBrideName(e.target.value)}
                className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                placeholder="Sarah"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-label uppercase text-mauve block mb-2">
                Groom or Partner 2 first name
              </label>
              <input
                type="text"
                required
                value={groomName}
                onChange={e => setGroomName(e.target.value)}
                className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                placeholder="James"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-label uppercase text-mauve block mb-2">
                Their email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                placeholder="sarah@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending...' : 'Send invitation'}
            </button>
            {status === 'error' && (
              <p className="text-sm text-red-500 text-center">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  )
}

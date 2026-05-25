'use client'

import { useState } from 'react'

export default function SignInSection() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

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

  return (
    <section className="bg-plum py-20 px-8">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-4">
          Already booked with us?
        </div>
        <h2 className="text-3xl md:text-4xl font-light text-cream mb-4 leading-tight">
          Already in the Inner Circle?
        </h2>

        {sent ? (
          <>
            <p className="font-serif italic text-xl text-mauve-soft mb-6">
              Your link is on its way
            </p>
            <p className="text-cream/70 text-base leading-relaxed">
              Check your inbox for an email from us. Click the link and you will be straight back in. No password, no fuss.
            </p>
          </>
        ) : (
          <>
            <p className="text-cream/70 text-base leading-relaxed mb-10">
              If we are capturing your wedding, your private space is waiting for you. Enter your email and we will send you a link straight back in.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent border border-cream/30 px-4 py-3 text-cream placeholder-cream/40 text-base focus:outline-none focus:border-cream/70"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 text-[11px] tracking-label uppercase border border-mauve text-mauve hover:bg-mauve hover:text-cream transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Sending...' : 'Send me a link'}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}

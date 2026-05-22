'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const router = useRouter()
  const [weddingDate, setWeddingDate] = useState('')
  const [venueName, setVenueName] = useState('')
  const [venueAddress, setVenueAddress] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    await fetch('/api/couple', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wedding_date: weddingDate,
        venue_name: venueName,
        venue_address: venueAddress,
      }),
    })

    router.replace('/home')
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        <div className="label-tag mb-6">Welcome to your Inner Circle</div>
        <h1 className="text-4xl font-light text-ink mb-3 leading-tight">
          Tell us about <span className="script-accent font-normal">your day</span>
        </h1>
        <p className="text-base text-whisper leading-relaxed mb-10">
          Just a few details and your space will be ready.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[11px] tracking-label uppercase text-mauve block mb-2">
              Wedding date
            </label>
            <input
              type="date"
              required
              value={weddingDate}
              onChange={e => setWeddingDate(e.target.value)}
              className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
            />
          </div>
          <div>
            <label className="text-[11px] tracking-label uppercase text-mauve block mb-2">
              Venue name
            </label>
            <input
              type="text"
              required
              value={venueName}
              onChange={e => setVenueName(e.target.value)}
              className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
              placeholder="Darver Castle"
            />
          </div>
          <div>
            <label className="text-[11px] tracking-label uppercase text-mauve block mb-2">
              Venue address
            </label>
            <input
              type="text"
              value={venueAddress}
              onChange={e => setVenueAddress(e.target.value)}
              className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
              placeholder="Full address for Google Maps pin drops"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Open my Inner Circle'}
          </button>
        </form>
      </div>
    </main>
  )
}

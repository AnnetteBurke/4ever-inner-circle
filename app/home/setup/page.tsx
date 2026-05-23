'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const VENUES = [
  { name: 'Ballymascanlon Hotel', slug: 'ballymascanlon' },
  { name: 'Bellingham Castle', slug: 'bellingham-castle' },
  { name: 'Cabra Castle', slug: 'cabra-castle' },
  { name: 'Carrickdale Hotel', slug: 'carrickdale-hotel' },
  { name: 'Darver Castle', slug: 'darver-castle' },
  { name: 'Four Seasons Carlingford', slug: 'four-seasons-carlingford' },
  { name: 'Galgorm Hotel', slug: 'galgorm-hotel' },
  { name: 'Harveys Point', slug: 'harveys-point' },
  { name: 'Leighinmohr House', slug: 'leighinmohr-house' },
  { name: 'Merchant Hotel', slug: 'merchant-hotel' },
  { name: 'Ross Harbour', slug: 'ross-harbour' },
  { name: 'Tinakilly', slug: 'tinakilly' },
  { name: 'Tullyglass Hotel', slug: 'tullyglass-hotel' },
  { name: 'Other venue', slug: '' },
]

export default function SetupPage() {
  const router = useRouter()
  const [weddingDate, setWeddingDate] = useState('')
  const [venueSlug, setVenueSlug] = useState('')
  const [venueName, setVenueName] = useState('')
  const [venueAddress, setVenueAddress] = useState('')
  const [saving, setSaving] = useState(false)

  function handleVenueSelect(slug: string, name: string) {
    setVenueSlug(slug)
    setVenueName(slug ? name : '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    await fetch('/api/couple', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wedding_date: weddingDate,
        venue_name: venueName,
        venue_slug: venueSlug || null,
        venue_address: venueAddress,
      }),
    })

    router.replace('/home')
  }

  const selectedVenue = VENUES.find(v => v.slug === venueSlug)

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
              Your venue
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VENUES.map(v => (
                <button
                  key={v.slug || 'other'}
                  type="button"
                  onClick={() => handleVenueSelect(v.slug, v.name)}
                  className={`px-3 py-2.5 text-left text-sm border transition-colors ${
                    selectedVenue?.slug === v.slug && selectedVenue?.name === v.name
                      ? 'border-mauve bg-blush-soft text-plum'
                      : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
            {venueSlug === '' && selectedVenue?.name === 'Other venue' && (
              <input
                type="text"
                required
                value={venueName}
                onChange={e => setVenueName(e.target.value)}
                placeholder="Type your venue name"
                className="mt-3 w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
              />
            )}
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
            disabled={saving || !venueName}
            className="w-full py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Open my Inner Circle'}
          </button>
        </form>
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'

const VENUES = [
  { name: 'Ballymascanlon Hotel', slug: 'ballymascanlon', address: 'Ballymascanlon, Dundalk, Co. Louth, Ireland' },
  { name: 'Bellingham Castle', slug: 'bellingham-castle', address: 'Castlebellingham, Co. Louth, Ireland' },
  { name: 'Cabra Castle', slug: 'cabra-castle', address: 'Kingscourt, Co. Cavan, Ireland' },
  { name: 'Carrickdale Hotel', slug: 'carrickdale-hotel', address: 'Carrickcarnon, Dundalk, Co. Louth, Ireland' },
  { name: 'Darver Castle', slug: 'darver-castle', address: 'Darver, Dundalk, Co. Louth, Ireland' },
  { name: 'Four Seasons Carlingford', slug: 'four-seasons-carlingford', address: 'Carlingford, Co. Louth, Ireland' },
  { name: 'Galgorm Hotel', slug: 'galgorm-hotel', address: '136 Fenaghy Road, Ballymena, BT42 1EA, Northern Ireland' },
  { name: 'Harveys Point', slug: 'harveys-point', address: 'Lough Eske, Donegal Town, Co. Donegal, Ireland' },
  { name: 'Leighinmohr House', slug: 'leighinmohr-house', address: 'Galgorm Road, Ballymena, BT42 1EA, Northern Ireland' },
  { name: 'Merchant Hotel', slug: 'merchant-hotel', address: '16 Skipper Street, Belfast, BT1 2DZ, Northern Ireland' },
  { name: 'Ross Harbour', slug: 'ross-harbour', address: '435-437 Boa Island Road, Leggs, Enniskillen, BT93 2AL, Northern Ireland' },
  { name: 'Tinakilly', slug: 'tinakilly', address: 'Rathnew, Co. Wicklow, Ireland' },
  { name: 'Tullyglass Hotel', slug: 'tullyglass-hotel', address: 'Fenaghy Road, Ballymena, Co. Antrim, Northern Ireland' },
  { name: 'Other', slug: '', address: '' },
]

type FormState = {
  email: string
  brideName: string
  groomName: string
  partner1Gender: 'woman' | 'man'
  partner2Gender: 'woman' | 'man'
  weddingDate: string
  venueSlug: string
  venueName: string
  venueAddress: string
  ceremonyName: string
  ceremonyAddress: string
}

const empty: FormState = {
  email: '',
  brideName: '',
  groomName: '',
  partner1Gender: 'woman',
  partner2Gender: 'man',
  weddingDate: '',
  venueSlug: '_unset',
  venueName: '',
  venueAddress: '',
  ceremonyName: '',
  ceremonyAddress: '',
}

export default function InvitePage() {
  const [form, setForm] = useState<FormState>(empty)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function set(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleVenueChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value
    if (slug === '_unset') {
      setForm(f => ({ ...f, venueSlug: '_unset', venueName: '', venueAddress: '' }))
    } else if (slug === '') {
      setForm(f => ({ ...f, venueSlug: '', venueName: '', venueAddress: '' }))
    } else {
      const venue = VENUES.find(v => v.slug === slug)
      setForm(f => ({
        ...f,
        venueSlug: slug,
        venueName: venue?.name ?? '',
        venueAddress: venue?.address ?? '',
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        brideName: form.brideName,
        groomName: form.groomName,
        partner1Gender: form.partner1Gender,
        partner2Gender: form.partner2Gender,
        weddingDate: form.weddingDate,
        venueName: form.venueName,
        venueSlug: form.venueSlug === '_unset' ? null : (form.venueSlug || null),
        venueAddress: form.venueAddress,
        ceremonyName: form.ceremonyName,
        ceremonyAddress: form.ceremonyAddress,
      }),
    })

    if (res.ok) {
      setStatus('sent')
    } else {
      const body = await res.json()
      setErrorMsg(body.error || 'Unknown error')
      setStatus('error')
    }
  }

  const isOtherVenue = form.venueSlug === ''

  if (status === 'sent') {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="max-w-md w-full px-8 text-center py-12 border border-hairline">
          <p className="font-serif italic text-2xl text-plum mb-3">Invitation sent</p>
          <p className="text-sm text-whisper mb-1">
            {form.brideName} and {form.groomName}'s Inner Circle is ready.
          </p>
          <p className="text-sm text-whisper">Their link is on its way to {form.email}.</p>
          <button
            onClick={() => { setStatus('idle'); setForm(empty) }}
            className="mt-8 text-[11px] tracking-label uppercase text-mauve border border-mauve px-8 py-3 hover:bg-mauve hover:text-cream transition-colors"
          >
            Invite another couple
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream py-16">
      <div className="max-w-xl w-full mx-auto px-8">
        <div className="label-tag mb-6">Admin</div>
        <h1 className="text-4xl font-light text-ink mb-2">Set up a couple's space</h1>
        <p className="text-base text-whisper mb-12">
          Fill in their details and send the invitation. Their Inner Circle will be ready and waiting when they click the link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">

          <fieldset>
            <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">The couple</legend>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-[11px] tracking-label uppercase text-whisper block">Partner 1</label>
                <input
                  type="text"
                  required
                  value={form.brideName}
                  onChange={e => set('brideName', e.target.value)}
                  className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                  placeholder="Sarah"
                />
                <div className="grid grid-cols-2 gap-2">
                  {(['woman', 'man'] as const).map(g => (
                    <button key={g} type="button"
                      onClick={() => setForm(f => ({ ...f, partner1Gender: g }))}
                      className={`py-2 text-xs border transition-colors ${form.partner1Gender === g ? 'border-plum bg-plum text-cream' : 'border-hairline text-whisper hover:border-mauve'}`}>
                      {g === 'woman' ? 'Woman' : 'Man'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] tracking-label uppercase text-whisper block">Partner 2</label>
                <input
                  type="text"
                  required
                  value={form.groomName}
                  onChange={e => set('groomName', e.target.value)}
                  className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                  placeholder="James"
                />
                <div className="grid grid-cols-2 gap-2">
                  {(['woman', 'man'] as const).map(g => (
                    <button key={g} type="button"
                      onClick={() => setForm(f => ({ ...f, partner2Gender: g }))}
                      className={`py-2 text-xs border transition-colors ${form.partner2Gender === g ? 'border-plum bg-plum text-cream' : 'border-hairline text-whisper hover:border-mauve'}`}>
                      {g === 'woman' ? 'Woman' : 'Man'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Email address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                  placeholder="sarah@example.com"
                />
              </div>
              <div>
                <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Wedding date</label>
                <input
                  type="date"
                  required
                  value={form.weddingDate}
                  onChange={e => set('weddingDate', e.target.value)}
                  className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Reception venue</legend>
            <div className="mb-4">
              <select
                required
                value={form.venueSlug}
                onChange={handleVenueChange}
                className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
              >
                <option value="_unset" disabled>Select a venue</option>
                {VENUES.map(v => (
                  <option key={v.slug || 'other'} value={v.slug}>{v.name}</option>
                ))}
              </select>
            </div>
            {isOtherVenue && (
              <div className="mb-4">
                <input
                  type="text"
                  required
                  value={form.venueName}
                  onChange={e => set('venueName', e.target.value)}
                  className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                  placeholder="Venue name"
                />
              </div>
            )}
            <div>
              <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Venue address</label>
              <input
                type="text"
                value={form.venueAddress}
                onChange={e => set('venueAddress', e.target.value)}
                className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                placeholder="Full address for map links"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Ceremony / service location</legend>
            <div className="mb-4">
              <input
                type="text"
                value={form.ceremonyName}
                onChange={e => set('ceremonyName', e.target.value)}
                className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                placeholder="St. Patrick's Church, Dundalk"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Ceremony address</label>
              <input
                type="text"
                value={form.ceremonyAddress}
                onChange={e => set('ceremonyAddress', e.target.value)}
                className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                placeholder="Full address for map links"
              />
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending...' : 'Send invitation'}
          </button>

          {status === 'error' && (
            <p className="text-sm text-red-500 text-center">Error: {errorMsg}</p>
          )}
        </form>
      </div>
    </main>
  )
}

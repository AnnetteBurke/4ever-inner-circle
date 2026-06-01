'use client'

import { useState, useEffect } from 'react'
import PhoneInput from '@/components/PhoneInput'
import { CeremonyAutocomplete, PrepAutocomplete } from '@/components/LocationAutocomplete'

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

type MarriageType = 'bride_groom' | 'two_brides' | 'two_grooms'

type FormState = {
  marriageType: MarriageType
  partner1Name: string
  partner1Email: string
  partner1Mobile: string
  partner2Name: string
  partner2Email: string
  partner2Mobile: string
  weddingDate: string
  ceremonyTime: string
  venueSlug: string
  venueName: string
  venueAddress: string
  ceremonyName: string
  ceremonyAddress: string
  bridePrep: string
  groomPrep: string
  secondPhotographerEmail: string
}

const empty: FormState = {
  marriageType: 'bride_groom',
  partner1Name: '',
  partner1Email: '',
  partner1Mobile: '+44',
  partner2Name: '',
  partner2Email: '',
  partner2Mobile: '+44',
  weddingDate: '',
  ceremonyTime: '',
  venueSlug: '_unset',
  venueName: '',
  venueAddress: '',
  ceremonyName: '',
  ceremonyAddress: '',
  bridePrep: '',
  groomPrep: '',
  secondPhotographerEmail: '',
}

const MARRIAGE_TYPES = [
  { value: 'bride_groom', label: 'Bride & Groom', p1: 'Bride', p2: 'Groom', p1Gender: 'woman', p2Gender: 'man' },
  { value: 'two_brides', label: 'Two Brides', p1: 'Bride 1', p2: 'Bride 2', p1Gender: 'woman', p2Gender: 'woman' },
  { value: 'two_grooms', label: 'Two Grooms', p1: 'Groom 1', p2: 'Groom 2', p1Gender: 'man', p2Gender: 'man' },
] as const

const inputClass = 'w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve'
const labelClass = 'text-[11px] tracking-label uppercase text-whisper block mb-2'

export default function InviteForm({
  ceremonyLocations,
  prepLocations,
}: {
  ceremonyLocations: { name: string; address: string }[]
  prepLocations: string[]
}) {
  const [form, setForm] = useState<FormState>(empty)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [liveLocations, setLiveLocations] = useState(ceremonyLocations)
  const [livePrepLocations, setLivePrepLocations] = useState(prepLocations)
  const [customVenues, setCustomVenues] = useState<{ name: string; address: string }[]>([])

  useEffect(() => {
    fetch('/api/locations')
      .then(r => r.json())
      .then(data => {
        if (data.ceremony) setLiveLocations(data.ceremony)
        if (data.prep) setLivePrepLocations(data.prep)
        if (data.customVenues) setCustomVenues(data.customVenues)
      })
      .catch(() => {})
  }, [])

  function set(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleVenueChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value
    if (slug === '_unset') {
      setForm(f => ({ ...f, venueSlug: '_unset', venueName: '', venueAddress: '' }))
    } else if (slug === '') {
      setForm(f => ({ ...f, venueSlug: '', venueName: '', venueAddress: '' }))
    } else if (slug.startsWith('custom:')) {
      const name = slug.replace('custom:', '')
      const venue = customVenues.find(v => v.name === name)
      setForm(f => ({ ...f, venueSlug: '', venueName: venue?.name ?? name, venueAddress: venue?.address ?? '' }))
    } else {
      const venue = VENUES.find(v => v.slug === slug)
      setForm(f => ({ ...f, venueSlug: slug, venueName: venue?.name ?? '', venueAddress: venue?.address ?? '' }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    const marriageConfig = MARRIAGE_TYPES.find(m => m.value === form.marriageType)!

    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.partner1Email,
        brideName: form.partner1Name,
        groomName: form.partner2Name,
        partner1Gender: marriageConfig.p1Gender,
        partner2Gender: marriageConfig.p2Gender,
        partner1Mobile: form.partner1Mobile,
        partner2Mobile: form.partner2Mobile,
        partner2Email: form.partner2Email,
        weddingDate: form.weddingDate,
        ceremonyTime: form.ceremonyTime,
        venueName: form.venueName,
        venueSlug: form.venueSlug === '_unset' ? null : (form.venueSlug || null),
        venueAddress: form.venueAddress,
        ceremonyName: form.ceremonyName,
        ceremonyAddress: form.ceremonyAddress,
        bridePrep: form.bridePrep,
        groomPrep: form.groomPrep,
        secondPhotographerEmail: form.secondPhotographerEmail || null,
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

  const marriageConfig = MARRIAGE_TYPES.find(m => m.value === form.marriageType)!
  const isOtherVenue = form.venueSlug === ''

  if (status === 'sent') {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="max-w-md w-full px-8 text-center py-12 border border-hairline">
          <p className="font-serif italic text-2xl text-plum mb-3">Invitation sent</p>
          <p className="text-sm text-whisper mb-1">
            {form.partner1Name} and {form.partner2Name}&apos;s Inner Circle is ready.
          </p>
          <p className="text-sm text-whisper mb-1">
            Their invitation is on its way to {form.partner1Email}.
          </p>
          {form.partner1Mobile && (
            <p className="text-sm text-whisper">A WhatsApp has been sent to {form.partner1Mobile} to check their inbox.</p>
          )}
          <button
            onClick={() => { window.location.reload() }}
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
      <div className="max-w-2xl w-full mx-auto px-8">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-6">Admin</div>
        <h1 className="text-4xl font-light text-ink mb-2">Set up a couple&apos;s space</h1>
        <p className="text-base text-whisper mb-12">
          Fill in everything you know. The more you add now, the more populated their dashboard will be when they first open it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Type of marriage */}
          <fieldset>
            <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Type of marriage</legend>
            <div className="grid grid-cols-3 gap-3">
              {MARRIAGE_TYPES.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, marriageType: m.value }))}
                  className={`py-4 text-sm border transition-colors ${
                    form.marriageType === m.value
                      ? 'bg-plum border-plum text-cream'
                      : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* The couple */}
          <fieldset>
            <legend className="text-[11px] tracking-label uppercase text-mauve mb-6 block">The couple</legend>
            <div className="grid grid-cols-2 gap-6">

              {/* Partner 1 */}
              <div className="space-y-4">
                <p className="text-sm font-light text-ink border-b border-hairline pb-2">{marriageConfig.p1}</p>
                <div>
                  <label className={labelClass}>Name</label>
                  <input type="text" required value={form.partner1Name} onChange={e => set('partner1Name', e.target.value)} className={inputClass} placeholder="Sarah" />
                </div>
                <div>
                  <label className={labelClass}>Email — for the invitation link</label>
                  <input type="email" required value={form.partner1Email} onChange={e => set('partner1Email', e.target.value)} className={inputClass} placeholder="sarah@example.com" />
                </div>
                <div>
                  <label className={labelClass}>Mobile — for WhatsApp</label>
                  <PhoneInput value={form.partner1Mobile} onChange={v => set('partner1Mobile', v)} containerClass="w-full" />
                </div>
              </div>

              {/* Partner 2 */}
              <div className="space-y-4">
                <p className="text-sm font-light text-ink border-b border-hairline pb-2">{marriageConfig.p2}</p>
                <div>
                  <label className={labelClass}>Name</label>
                  <input type="text" required value={form.partner2Name} onChange={e => set('partner2Name', e.target.value)} className={inputClass} placeholder="James" />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={form.partner2Email} onChange={e => set('partner2Email', e.target.value)} className={inputClass} placeholder="james@example.com" />
                </div>
                <div>
                  <label className={labelClass}>Mobile — for WhatsApp</label>
                  <PhoneInput value={form.partner2Mobile} onChange={v => set('partner2Mobile', v)} containerClass="w-full" />
                </div>
              </div>
            </div>
          </fieldset>

          {/* The day */}
          <fieldset>
            <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">The day</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Wedding date</label>
                <input type="date" required value={form.weddingDate} onChange={e => set('weddingDate', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Ceremony time</label>
                <input type="text" value={form.ceremonyTime} onChange={e => set('ceremonyTime', e.target.value)} className={inputClass} placeholder="e.g. 1:30pm" />
              </div>
            </div>
          </fieldset>

          {/* Reception venue */}
          <fieldset>
            <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Reception venue</legend>
            <div className="mb-4">
              <select required value={form.venueSlug} onChange={handleVenueChange} className={inputClass}>
                <option value="_unset" disabled>Select a venue</option>
                {VENUES.filter(v => v.name !== 'Other').map(v => (
                  <option key={v.slug} value={v.slug}>{v.name}</option>
                ))}
                {customVenues.filter(cv => !VENUES.find(v => v.name === cv.name)).map(cv => (
                  <option key={cv.name} value={`custom:${cv.name}`}>{cv.name}</option>
                ))}
                <option value="">Other / new venue</option>
              </select>
            </div>
            {isOtherVenue && (
              <div className="mb-4">
                <input type="text" required value={form.venueName} onChange={e => set('venueName', e.target.value)} className={inputClass} placeholder="Venue name" />
              </div>
            )}
            <div>
              <label className={labelClass}>Venue address</label>
              <input type="text" value={form.venueAddress} onChange={e => set('venueAddress', e.target.value)} className={inputClass} placeholder="Full address for map links" />
            </div>
          </fieldset>

          {/* Ceremony */}
          <fieldset>
            <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Ceremony location</legend>
            {form.venueName && (
              <button
                type="button"
                onClick={() => { set('ceremonyName', form.venueName); set('ceremonyAddress', form.venueAddress) }}
                className="mb-4 text-[11px] tracking-label uppercase text-mauve border border-mauve px-4 py-2 hover:bg-mauve hover:text-cream transition-colors"
              >
                Same as reception venue
              </button>
            )}
            <CeremonyAutocomplete
              nameValue={form.ceremonyName}
              addressValue={form.ceremonyAddress}
              onNameChange={v => set('ceremonyName', v)}
              onAddressChange={v => set('ceremonyAddress', v)}
              suggestions={liveLocations}
            />
          </fieldset>

          {/* Getting ready */}
          <fieldset>
            <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Getting ready locations</legend>
            <div className="grid grid-cols-2 gap-4">
              <PrepAutocomplete
                value={form.bridePrep}
                onChange={v => set('bridePrep', v)}
                label={`${marriageConfig.p1} getting ready`}
                suggestions={livePrepLocations}
              />
              <PrepAutocomplete
                value={form.groomPrep}
                onChange={v => set('groomPrep', v)}
                label={`${marriageConfig.p2} getting ready`}
                suggestions={livePrepLocations}
              />
            </div>
          </fieldset>

          {/* Photography team */}
          <fieldset>
            <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Photography team</legend>
            <div>
              <label className={labelClass}>Second photographer email (optional)</label>
              <input
                type="email"
                value={form.secondPhotographerEmail}
                onChange={e => set('secondPhotographerEmail', e.target.value)}
                className={inputClass}
                placeholder="second@example.com"
              />
              <p className="mt-2 text-[11px] text-whisper">
                If you have a second shooter on this wedding, add their email here. They will receive the 48-hour brief alongside you.
              </p>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-50"
          >
            {status === 'sending' ? 'Setting up their space...' : 'Send invitation'}
          </button>

          {status === 'error' && (
            <p className="text-sm text-red-500 text-center">Error: {errorMsg}</p>
          )}
        </form>
      </div>
    </main>
  )
}

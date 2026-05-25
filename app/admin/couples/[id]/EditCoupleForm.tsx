'use client'

import { useState } from 'react'

type Couple = {
  id: string
  bride_name: string
  groom_name: string
  wedding_date: string | null
  venue_name: string | null
  venue_address: string | null
  ceremony_name: string | null
  ceremony_address: string | null
  bride_mobile: string | null
  groom_mobile: string | null
  groom_email: string | null
  ceremony_time: string | null
  bride_prep_address: string | null
  groom_prep_address: string | null
  second_photographer_email: string | null
}

const inputClass = 'w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve'
const labelClass = 'text-[11px] tracking-label uppercase text-whisper block mb-2'

export default function EditCoupleForm({ couple }: { couple: Couple }) {
  const [form, setForm] = useState({
    bride_name: couple.bride_name ?? '',
    groom_name: couple.groom_name ?? '',
    wedding_date: couple.wedding_date ?? '',
    ceremony_time: couple.ceremony_time ?? '',
    venue_name: couple.venue_name ?? '',
    venue_address: couple.venue_address ?? '',
    ceremony_name: couple.ceremony_name ?? '',
    ceremony_address: couple.ceremony_address ?? '',
    bride_mobile: couple.bride_mobile ?? '',
    groom_mobile: couple.groom_mobile ?? '',
    groom_email: couple.groom_email ?? '',
    bride_prep_address: couple.bride_prep_address ?? '',
    groom_prep_address: couple.groom_prep_address ?? '',
    second_photographer_email: couple.second_photographer_email ?? '',
  })
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setStatus('idle')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')

    const res = await fetch(`/api/admin/couples/${couple.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bride_name: form.bride_name,
        groom_name: form.groom_name,
        wedding_date: form.wedding_date || null,
        ceremony_time: form.ceremony_time || null,
        venue_name: form.venue_name || null,
        venue_address: form.venue_address || null,
        ceremony_name: form.ceremony_name || null,
        ceremony_address: form.ceremony_address || null,
        bride_mobile: form.bride_mobile || null,
        groom_mobile: form.groom_mobile || null,
        groom_email: form.groom_email || null,
        bride_prep_address: form.bride_prep_address || null,
        groom_prep_address: form.groom_prep_address || null,
        second_photographer_email: form.second_photographer_email || null,
      }),
    })

    if (res.ok) {
      setStatus('saved')
    } else {
      const body = await res.json()
      setErrorMsg(body.error || 'Unknown error')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* Names */}
      <fieldset>
        <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">The couple</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Bride / Partner 1 name</label>
            <input type="text" value={form.bride_name} onChange={e => set('bride_name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Groom / Partner 2 name</label>
            <input type="text" value={form.groom_name} onChange={e => set('groom_name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Groom / Partner 2 email</label>
            <input type="email" value={form.groom_email} onChange={e => set('groom_email', e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* The day */}
      <fieldset>
        <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">The day</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Wedding date</label>
            <input type="date" value={form.wedding_date} onChange={e => set('wedding_date', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Ceremony time</label>
            <input type="text" value={form.ceremony_time} onChange={e => set('ceremony_time', e.target.value)} className={inputClass} placeholder="e.g. 1:30pm" />
          </div>
        </div>
      </fieldset>

      {/* Venue */}
      <fieldset>
        <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Reception venue</legend>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Venue name</label>
            <input type="text" value={form.venue_name} onChange={e => set('venue_name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Venue address</label>
            <input type="text" value={form.venue_address} onChange={e => set('venue_address', e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Ceremony */}
      <fieldset>
        <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Ceremony location</legend>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Ceremony name</label>
            <input type="text" value={form.ceremony_name} onChange={e => set('ceremony_name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Ceremony address</label>
            <input type="text" value={form.ceremony_address} onChange={e => set('ceremony_address', e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Getting ready */}
      <fieldset>
        <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Getting ready</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Bride getting ready</label>
            <input type="text" value={form.bride_prep_address} onChange={e => set('bride_prep_address', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Groom getting ready</label>
            <input type="text" value={form.groom_prep_address} onChange={e => set('groom_prep_address', e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Mobiles */}
      <fieldset>
        <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Mobile numbers</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Bride mobile</label>
            <input type="tel" value={form.bride_mobile} onChange={e => set('bride_mobile', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Groom mobile</label>
            <input type="tel" value={form.groom_mobile} onChange={e => set('groom_mobile', e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Photography team */}
      <fieldset>
        <legend className="text-[11px] tracking-label uppercase text-mauve mb-4 block">Photography team</legend>
        <div>
          <label className={labelClass}>Second photographer email</label>
          <input
            type="email"
            value={form.second_photographer_email}
            onChange={e => set('second_photographer_email', e.target.value)}
            className={inputClass}
            placeholder="second@example.com"
          />
          <p className="mt-2 text-[11px] text-whisper">
            If your second shooter changes, update this here. The 48-hour brief will go to whoever is listed when it sends. Leave blank if you are shooting solo.
          </p>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={status === 'saving'}
        className="w-full py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-50"
      >
        {status === 'saving' ? 'Saving...' : 'Save changes'}
      </button>

      {status === 'saved' && (
        <p className="text-sm text-center" style={{ color: '#5a8a5a' }}>Changes saved.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-500 text-center">Error: {errorMsg}</p>
      )}

    </form>
  )
}

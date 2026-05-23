'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ROLES } from '@/content/roles'

export type TemplateRecord = {
  id?: string
  template_key: string
  recipient_role: string
  channel: 'email' | 'sms' | 'whatsapp'
  send_offset_days: number
  send_time: string
  subject: string | null
  body: string
  notes: string | null
  active: boolean
}

const VARIABLES = [
  { token: '{first_name}', description: 'Their first name' },
  { token: '{couple_first_names}', description: 'e.g. Sarah & James' },
  { token: '{bride_first_name}', description: 'Partner 1\'s first name' },
  { token: '{groom_first_name}', description: 'Partner 2\'s first name' },
  { token: '{wedding_date}', description: 'e.g. Saturday 12th April 2026' },
  { token: '{wedding_venue}', description: 'Reception venue name' },
  { token: '{ceremony_venue}', description: 'Ceremony location name' },
  { token: '{google_maps_link_ceremony}', description: 'Google Maps link for ceremony' },
  { token: '{google_maps_link_bridal_suite}', description: 'Google Maps link for bridal prep' },
  { token: '{bridal_suite_address}', description: 'Bridal prep address' },
  { token: '{photographer_arrival_time}', description: 'Time photographer arrives' },
  { token: '{ceremony_time}', description: 'Ceremony start time' },
  { token: '{hair_makeup_start_time}', description: 'Hair & makeup start time' },
]

function offsetLabel(days: number): string {
  if (days === 0) return 'Wedding day'
  const abs = Math.abs(days)
  const dir = days < 0 ? 'before' : 'after'
  if (abs % 7 === 0) {
    const w = abs / 7
    return `${w} ${w === 1 ? 'week' : 'weeks'} ${dir}`
  }
  return `${abs} ${abs === 1 ? 'day' : 'days'} ${dir}`
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

export default function TemplateForm({ initial, mode }: { initial: TemplateRecord; mode: 'new' | 'edit' }) {
  const router = useRouter()
  const [form, setForm] = useState<TemplateRecord>(initial)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showVars, setShowVars] = useState(false)

  function set<K extends keyof TemplateRecord>(key: K, value: TemplateRecord[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')

    const url = mode === 'new' ? '/api/admin/templates' : `/api/admin/templates/${initial.id}`
    const method = mode === 'new' ? 'POST' : 'PUT'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/admin/templates')
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'Something went wrong')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this template? This cannot be undone.')) return
    setDeleting(true)
    await fetch(`/api/admin/templates/${initial.id}`, { method: 'DELETE' })
    router.push('/admin/templates')
    router.refresh()
  }

  const roleOptions = ROLES.filter(r => r.group !== 'couple')

  const inputClass = 'w-full border border-hairline bg-transparent px-4 py-3 text-ink text-sm focus:outline-none focus:border-mauve'
  const textareaClass = 'w-full border border-hairline bg-transparent px-4 py-3 text-ink text-sm focus:outline-none focus:border-mauve font-mono leading-relaxed'

  return (
    <div className="space-y-8">

      {/* Recipient & Channel */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] tracking-label uppercase text-whisper block">Who receives this?</label>
          <select
            value={form.recipient_role}
            onChange={e => set('recipient_role', e.target.value)}
            className={inputClass}
          >
            <option value="">Select a role</option>
            {roleOptions.map(r => (
              <option key={r.slug} value={r.slug}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] tracking-label uppercase text-whisper block">Channel</label>
          <div className="grid grid-cols-3 gap-2">
            {(['email', 'sms', 'whatsapp'] as const).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => set('channel', c)}
                className={`py-3 text-xs border transition-colors ${
                  form.channel === c
                    ? 'bg-plum border-plum text-cream'
                    : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                }`}
              >
                {c === 'whatsapp' ? 'WhatsApp' : c === 'sms' ? 'SMS' : 'Email'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timing */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] tracking-label uppercase text-whisper block">
            When to send
            <span className="normal-case not-italic font-normal ml-2 text-whisper/60">(negative = before wedding, 0 = wedding day, positive = after)</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={form.send_offset_days}
              onChange={e => set('send_offset_days', parseInt(e.target.value) || 0)}
              className={`${inputClass} max-w-[120px]`}
            />
            <span className="text-sm text-mauve italic">{offsetLabel(form.send_offset_days)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] tracking-label uppercase text-whisper block">Time of day</label>
          <input
            type="time"
            value={form.send_time}
            onChange={e => set('send_time', e.target.value)}
            className={`${inputClass} max-w-[160px]`}
          />
        </div>
      </div>

      {/* Subject (email only) */}
      {form.channel === 'email' && (
        <div className="space-y-2">
          <label className="text-[11px] tracking-label uppercase text-whisper block">Subject line</label>
          <input
            type="text"
            value={form.subject ?? ''}
            onChange={e => set('subject', e.target.value || null)}
            className={inputClass}
            placeholder="e.g. One week to go ✦"
          />
        </div>
      )}

      {/* Body */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] tracking-label uppercase text-whisper block">Message</label>
          <button
            type="button"
            onClick={() => setShowVars(v => !v)}
            className="text-[11px] tracking-label uppercase text-mauve hover:text-plum transition-colors"
          >
            {showVars ? 'Hide variables' : 'Show variables'}
          </button>
        </div>

        {showVars && (
          <div className="border border-hairline bg-blush-soft px-5 py-4 mb-3">
            <p className="text-[11px] tracking-label uppercase text-whisper mb-3">Available variables — copy and paste into your message</p>
            <div className="space-y-1.5">
              {VARIABLES.map(v => (
                <div key={v.token} className="flex gap-4 items-baseline">
                  <code className="text-xs text-plum font-mono w-52 flex-shrink-0">{v.token}</code>
                  <span className="text-xs text-whisper">{v.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <textarea
          value={form.body}
          onChange={e => set('body', e.target.value)}
          rows={14}
          className={textareaClass}
          placeholder="Write your message here. Use {first_name}, {couple_first_names} etc. to personalise it."
        />
      </div>

      {/* Internal notes */}
      <div className="space-y-2">
        <label className="text-[11px] tracking-label uppercase text-whisper block">Internal notes <span className="normal-case not-italic font-normal text-whisper/60">(not sent — just for your reference)</span></label>
        <textarea
          value={form.notes ?? ''}
          onChange={e => set('notes', e.target.value || null)}
          rows={2}
          className={textareaClass}
          placeholder="e.g. Make sure this goes out before the venue confirms timings"
        />
      </div>

      {/* Template key */}
      <div className="space-y-2">
        <label className="text-[11px] tracking-label uppercase text-whisper block">Template key <span className="normal-case not-italic font-normal text-whisper/60">(unique identifier, no spaces)</span></label>
        <input
          type="text"
          value={form.template_key}
          onChange={e => set('template_key', slugify(e.target.value))}
          className={inputClass}
          placeholder="e.g. bridesmaid_veil_tip"
        />
      </div>

      {/* Active */}
      <div className="flex items-center gap-4">
        <label className="text-[11px] tracking-label uppercase text-whisper">Active</label>
        <div className="flex gap-2">
          {([true, false] as const).map(v => (
            <button
              key={String(v)}
              type="button"
              onClick={() => set('active', v)}
              className={`py-2 px-5 text-xs border transition-colors ${
                form.active === v
                  ? 'bg-plum border-plum text-cream'
                  : 'border-hairline text-whisper hover:border-mauve'
              }`}
            >
              {v ? 'Yes' : 'No — paused'}
            </button>
          ))}
        </div>
        <p className="text-xs text-whisper/60 italic">Paused templates are stored but won&apos;t be scheduled for new people.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-hairline">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="py-4 px-12 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-40"
        >
          {saving ? 'Saving...' : mode === 'new' ? 'Create template' : 'Save changes'}
        </button>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="py-4 px-8 text-[11px] tracking-label uppercase border border-hairline text-whisper hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-40"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}

        <button
          type="button"
          onClick={() => router.push('/admin/templates')}
          className="text-[11px] tracking-label uppercase text-whisper hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>

    </div>
  )
}

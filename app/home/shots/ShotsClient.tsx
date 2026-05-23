'use client'

import { useState } from 'react'
import Link from 'next/link'

type ShotRequest = {
  id: string
  label: string
  people: string | null
  notes: string | null
}

type Props = {
  brideName: string
  groomName: string
  initialShots: ShotRequest[]
}

export default function ShotsClient({ brideName, groomName, initialShots }: Props) {
  const [shots, setShots] = useState<ShotRequest[]>(initialShots)
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [people, setPeople] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')

  function reset() {
    setLabel(''); setPeople(''); setNotes(''); setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!label) return
    setSaving(true)
    setError('')

    const res = await fetch('/api/shots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, people: people || null, notes: notes || null }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong'); setSaving(false); return }

    setShots(prev => [...prev, data])
    reset()
    setOpen(false)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await fetch(`/api/shots/${id}`, { method: 'DELETE' })
    setShots(prev => prev.filter(s => s.id !== id))
    setDeleting(null)
  }

  return (
    <main className="min-h-screen bg-cream">

      {/* Header */}
      <div className="bg-plum text-cream px-8 md:px-16 pt-12 pb-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/home" className="text-[11px] tracking-label uppercase text-mauve-soft hover:text-cream transition-colors mb-6 block">
            ← Back to your Inner Circle
          </Link>
          <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">Photography</div>
          <h1 className="text-4xl md:text-5xl font-light text-cream leading-tight">Shot Requests</h1>
          <p className="text-cream/60 text-base mt-3 max-w-xl">
            Tell us about any specific group shots you would love on the day. Beyond the family groups, these are the moments that matter to you personally.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-16">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-whisper">
              Standard family groups are already planned from your circle. Add anything extra here.
            </p>
            <p className="text-xs text-whisper/60 mt-1 italic">
              e.g. All my school friends, The aunties on {brideName}&apos;s side, Cousins together
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="text-[11px] tracking-label uppercase text-mauve border border-mauve px-5 py-2 hover:bg-mauve hover:text-cream transition-colors flex-shrink-0 ml-6"
          >
            + Add shot
          </button>
        </div>

        {shots.length === 0 ? (
          <div className="border border-hairline px-8 py-12 text-center">
            <p className="text-sm text-whisper italic mb-2">No shot requests yet.</p>
            <p className="text-xs text-whisper/60">Add any groups or moments you want to make sure we capture.</p>
          </div>
        ) : (
          <div className="border border-hairline divide-y divide-hairline">
            {shots.map((shot, i) => (
              <div key={shot.id} className="px-6 py-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-[11px] tracking-label uppercase text-mauve-soft w-6 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-light text-ink">{shot.label}</span>
                  </div>
                  {(shot.people || shot.notes) && (
                    <div className="pl-9 flex flex-wrap gap-x-6 gap-y-1 text-sm text-whisper">
                      {shot.people && <span>{shot.people}</span>}
                      {shot.notes && <span className="italic">{shot.notes}</span>}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(shot.id)}
                  disabled={deleting === shot.id}
                  className="text-[11px] tracking-label uppercase text-whisper hover:text-mauve transition-colors flex-shrink-0 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {shots.length > 0 && (
          <p className="text-xs text-whisper/60 mt-6 italic">
            {shots.length} shot {shots.length === 1 ? 'request' : 'requests'} saved. We will work through these after the family groups on the day.
          </p>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => { setOpen(false); reset() }} />
          <div className="relative bg-cream w-full max-w-md mx-auto px-8 py-10 max-h-[90vh] overflow-y-auto">

            <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Shot Request</div>
            <h2 className="text-2xl font-light text-ink mb-8">Add a shot</h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">
                  What do you want to call this shot?
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                  placeholder="e.g. All the aunties, School friends, Cousins"
                />
              </div>

              <div>
                <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">
                  Who is in this shot?
                </label>
                <textarea
                  value={people}
                  onChange={e => setPeople(e.target.value)}
                  rows={3}
                  className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve resize-none"
                  placeholder={`List names or describe the group, e.g. Lisa, Karen and Meg from school, or all of ${brideName}'s cousins`}
                />
              </div>

              <div>
                <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">
                  Anything else we should know?
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve resize-none"
                  placeholder="e.g. This group will be at the drinks reception, one person uses a wheelchair"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !label}
                  className="flex-1 py-3 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-40"
                >
                  {saving ? 'Saving...' : 'Add to list'}
                </button>
                <button
                  type="button"
                  onClick={() => { setOpen(false); reset() }}
                  className="px-6 py-3 text-[11px] tracking-label uppercase border border-hairline text-whisper hover:border-mauve hover:text-ink transition-colors"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </main>
  )
}

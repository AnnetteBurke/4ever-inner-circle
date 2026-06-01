'use client'

import { useState } from 'react'
import { ROLES } from '@/content/roles'
import PhoneInput from '@/components/PhoneInput'

type Person = {
  id: string
  name: string
  role: string | null
  phone: string | null
  email: string | null
  notes: string | null
  additional_needs: string | null
  is_family: boolean
  side: string | null
  family_relationship: string | null
  child_name: string | null
  age: number | null
  in_family_photos: boolean
}

type Props = {
  person: Person
  onSave: (updated: Person) => void
  onClose: () => void
}

export default function EditPersonModal({ person, onSave, onClose }: Props) {
  const [name, setName] = useState(person.name)
  const [phone, setPhone] = useState(person.phone ?? '')
  const [email, setEmail] = useState(person.email ?? '')
  const [notes, setNotes] = useState(person.notes ?? '')
  const [additionalNeeds, setAdditionalNeeds] = useState(person.additional_needs ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isOtherSupplier = person.role === 'supplier_other'
  const isChildRelationship = person.family_relationship === 'Son' || person.family_relationship === 'Daughter'
  const childAgeNum = person.age
  const showPhone = !isChildRelationship || (childAgeNum !== null && childAgeNum >= 12)

  const roleDisplay = person.role
    ? (ROLES.find(r => r.slug === person.role)?.label ?? person.role)
    : person.family_relationship ?? null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')

    const res = await fetch(`/api/people/${person.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone || null,
        email: email || null,
        notes: notes || null,
        additional_needs: additionalNeeds || null,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setSaving(false)
      return
    }

    onSave({ ...person, ...data })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-cream w-full max-w-md mx-auto px-8 py-10 max-h-[90vh] overflow-y-auto">

        {roleDisplay && (
          <div className="text-[11px] tracking-label uppercase text-mauve mb-2">{roleDisplay}</div>
        )}
        <h2 className="text-2xl font-light text-ink mb-8">Edit details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">
              {person.role === 'flower_girl_guardian' || person.role === 'page_boy_guardian'
                ? "Parent's name"
                : 'Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
            />
          </div>

          {showPhone && (
            <div>
              <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Mobile number</label>
              <PhoneInput value={phone} onChange={setPhone} containerClass="w-full" />
            </div>
          )}

          {showPhone && (
            <div>
              <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                placeholder="email@example.com"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Additional needs or considerations</label>
            <textarea
              value={additionalNeeds}
              onChange={e => setAdditionalNeeds(e.target.value)}
              rows={2}
              className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve resize-none"
              placeholder="e.g. Autism, uses a wheelchair, mobility issues, serious illness"
            />
          </div>

          {isOtherSupplier ? (
            <div>
              <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Type of supplier</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                placeholder="e.g. Photo booth, Fireworks, Dance floor"
              />
            </div>
          ) : (
            <div>
              <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Anything else</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve resize-none"
                placeholder="Anything useful to note"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex-1 py-3 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-40"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-[11px] tracking-label uppercase border border-hairline text-whisper hover:border-mauve hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

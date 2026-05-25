'use client'

import { useState } from 'react'
import { ROLES } from '@/content/roles'
import PhoneInput from '@/components/PhoneInput'

const FAMILY_RELATIONSHIPS = [
  'Son', 'Daughter',
  'Mum', 'Dad', 'Step-mum', 'Step-dad',
  'Sister', 'Brother', 'Step-sister', 'Step-brother',
  'Sister-in-law', 'Brother-in-law',
  'Niece', 'Nephew',
  'Grandmother', 'Grandfather',
  'Step-grandmother', 'Step-grandfather',
  'Aunt', 'Uncle', 'Cousin', 'Other',
]

const CHILD_RELATIONSHIPS = ['Son', 'Daughter']

const SIBLING_RELATIONSHIPS = ['Sister', 'Brother', 'Step-sister', 'Step-brother']

type Group = 'bridal_party' | 'family' | 'supplier'
type Step = 'main' | 'partner_question' | 'partner_form'

type Person = {
  id: string
  name: string
  role: string | null
  phone: string | null
  email: string | null
  notes: string | null
  is_family: boolean
  side: string | null
  family_relationship: string | null
  child_name: string | null
  age: number | null
  additional_needs: string | null
  in_family_photos: boolean
}

type Props = {
  group: Group
  brideName: string
  groomName: string
  onAdd: (person: Person) => void
}

const GROUP_LABELS: Record<Group, string> = {
  bridal_party: 'Bridal Party',
  family: 'Family',
  supplier: 'Suppliers',
}

export default function AddPersonModal({ group, brideName, groomName, onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('main')

  // Main form fields
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [familyOrFriend, setFamilyOrFriend] = useState<'family' | 'friend' | null>(null)
  const [side, setSide] = useState<'partner_1' | 'partner_2' | ''>('')
  const [familyRelationship, setFamilyRelationship] = useState('')
  const [childName, setChildName] = useState('')
  const [age, setAge] = useState('')
  const [additionalNeeds, setAdditionalNeeds] = useState('')
  const [phone, setPhone] = useState('+44')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Saved sibling info for partner step
  const [savedPersonName, setSavedPersonName] = useState('')
  const [savedPersonSide, setSavedPersonSide] = useState<'partner_1' | 'partner_2' | ''>('')
  const [savedPersonRelationship, setSavedPersonRelationship] = useState('')

  // Partner form fields
  const [partnerName, setPartnerName] = useState('')
  const [partnerPhone, setPartnerPhone] = useState('+44')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [partnerInPhotos, setPartnerInPhotos] = useState<boolean | null>(null)
  const [partnerSaving, setPartnerSaving] = useState(false)
  const [partnerError, setPartnerError] = useState('')

  function reset() {
    setName(''); setRole(''); setFamilyOrFriend(null); setSide('')
    setFamilyRelationship(''); setChildName(''); setAge(''); setAdditionalNeeds(''); setPhone('+44'); setEmail('')
    setNotes(''); setError(''); setStep('main')
    setSavedPersonName(''); setSavedPersonSide('')
    setPartnerName(''); setPartnerPhone('+44'); setPartnerEmail('')
    setPartnerInPhotos(null); setPartnerError('')
  }

  const isChildRole = role === 'flower_girl_guardian' || role === 'page_boy_guardian'
  const childLabel = role === 'flower_girl_guardian' ? "Flower girl's name" : "Page boy's name"
  const isOtherSupplier = role === 'supplier_other'

  const isFamily = group === 'family' || familyOrFriend === 'family'
  const needsSide = isFamily
  const needsRelationship = isFamily

  const isChildRelationship = CHILD_RELATIONSHIPS.includes(familyRelationship)
  const childAgeNum = age ? parseInt(age) : null
  const showPhone = !isChildRelationship || (childAgeNum !== null && childAgeNum >= 12)

  function isValid() {
    if (!name) return false
    if (group === 'bridal_party' && !role) return false
    if (group === 'bridal_party' && !familyOrFriend) return false
    if (group === 'supplier' && !role) return false
    if (needsSide && !side) return false
    if (needsRelationship && !familyRelationship) return false
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid()) return
    setSaving(true)
    setError('')

    const res = await fetch('/api/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        role: role || null,
        phone: phone || null,
        email: email || null,
        notes: notes || null,
        is_family: isFamily,
        side: needsSide ? side : null,
        family_relationship: needsRelationship ? familyRelationship : null,
        child_name: isChildRole ? childName : null,
        age: isChildRelationship && childAgeNum !== null ? childAgeNum : null,
        additional_needs: additionalNeeds || null,
        in_family_photos: false,
      }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong'); setSaving(false); return }

    onAdd(data)
    setSaving(false)

    const isSibling = isFamily && SIBLING_RELATIONSHIPS.includes(familyRelationship)
    if (isSibling) {
      setSavedPersonName(name)
      setSavedPersonSide(side as 'partner_1' | 'partner_2' | '')
      setSavedPersonRelationship(familyRelationship)
      setName(''); setRole(''); setFamilyOrFriend(null); setSide('')
      setFamilyRelationship(''); setChildName(''); setPhone('+44'); setEmail('')
      setNotes(''); setError('')
      setStep('partner_question')
    } else {
      reset()
      setOpen(false)
    }
  }

  async function handlePartnerSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!partnerName || partnerInPhotos === null) return
    setPartnerSaving(true)
    setPartnerError('')

    const res = await fetch('/api/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: partnerName,
        role: null,
        phone: partnerPhone || null,
        email: partnerEmail || null,
        notes: `Partner of ${savedPersonName}`,
        is_family: true,
        side: savedPersonSide || null,
        family_relationship: ['Sister', 'Step-sister'].includes(savedPersonRelationship)
          ? 'Brother-in-law'
          : ['Brother', 'Step-brother'].includes(savedPersonRelationship)
            ? 'Sister-in-law'
            : 'Partner',
        child_name: null,
        in_family_photos: partnerInPhotos,
      }),
    })

    const data = await res.json()
    if (!res.ok) { setPartnerError(data.error || 'Something went wrong'); setPartnerSaving(false); return }

    onAdd(data)
    setPartnerSaving(false)
    reset()
    setOpen(false)
  }

  const bridalPartyRoles = ROLES.filter(r => r.group === 'bridal_party')
  const supplierRoles = ROLES.filter(r => r.group === 'supplier')

  function sideLabel(s: string) {
    if (s === 'partner_1') return `${brideName}'s side`
    if (s === 'partner_2') return `${groomName}'s side`
    return ''
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[11px] tracking-label uppercase text-mauve border border-mauve px-5 py-2 hover:bg-mauve hover:text-cream transition-colors"
      >
        + Add person
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => { setOpen(false); reset() }} />
          <div className="relative bg-cream w-full max-w-md mx-auto px-8 py-10 max-h-[90vh] overflow-y-auto">

            {/* ── STEP: main form ── */}
            {step === 'main' && (
              <>
                <div className="text-[11px] tracking-label uppercase text-mauve mb-2">{GROUP_LABELS[group]}</div>
                <h2 className="text-2xl font-light text-ink mb-8">Add a person</h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {group === 'bridal_party' && (
                    <div>
                      <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Role</label>
                      <select
                        required
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                      >
                        <option value="" disabled>Select a role</option>
                        {bridalPartyRoles.map(r => (
                          <option key={r.slug} value={r.slug}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {group === 'supplier' && (
                    <div>
                      <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Type of supplier</label>
                      <select
                        required
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                      >
                        <option value="" disabled>Select a type</option>
                        {supplierRoles.map(r => (
                          <option key={r.slug} value={r.slug}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">
                      {isChildRole ? "Parent's name" : 'Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                      placeholder="Full name"
                    />
                  </div>

                  {group === 'bridal_party' && (
                    <div>
                      <label className="text-[11px] tracking-label uppercase text-whisper block mb-3">Are they family or a friend?</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['friend', 'family'] as const).map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { setFamilyOrFriend(opt); setSide(''); setFamilyRelationship('') }}
                            className={`py-3 text-sm border transition-colors capitalize ${
                              familyOrFriend === opt
                                ? 'border-plum bg-plum text-cream'
                                : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                            }`}
                          >
                            {opt === 'friend' ? 'Friend' : 'Family'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {needsSide && (
                    <div>
                      <label className="text-[11px] tracking-label uppercase text-whisper block mb-3">Which side of the family?</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSide('partner_1')}
                          className={`py-3 text-sm border transition-colors ${
                            side === 'partner_1'
                              ? 'border-plum bg-plum text-cream'
                              : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                          }`}
                        >
                          {brideName}&apos;s side
                        </button>
                        <button
                          type="button"
                          onClick={() => setSide('partner_2')}
                          className={`py-3 text-sm border transition-colors ${
                            side === 'partner_2'
                              ? 'border-plum bg-plum text-cream'
                              : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                          }`}
                        >
                          {groomName}&apos;s side
                        </button>
                      </div>
                    </div>
                  )}

                  {needsRelationship && (
                    <div>
                      <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Relationship</label>
                      <select
                        value={familyRelationship}
                        onChange={e => setFamilyRelationship(e.target.value)}
                        className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                      >
                        <option value="" disabled>Select relationship</option>
                        {FAMILY_RELATIONSHIPS.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {isChildRole && (
                    <div>
                      <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">{childLabel}</label>
                      <input
                        type="text"
                        value={childName}
                        onChange={e => setChildName(e.target.value)}
                        className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                        placeholder="Child's first name"
                      />
                    </div>
                  )}

                  {isChildRelationship && (
                    <div>
                      <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Age</label>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                        placeholder="e.g. 8"
                      />
                    </div>
                  )}

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
                      placeholder="e.g. Autism, uses a wheelchair, mobility issues, serious illness — anything we should be aware of on the day"
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
                      disabled={saving || !isValid()}
                      className="flex-1 py-3 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-40"
                    >
                      {saving ? 'Saving...' : 'Add to circle'}
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
              </>
            )}

            {/* ── STEP: partner question ── */}
            {step === 'partner_question' && (
              <>
                <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Family</div>
                <h2 className="text-2xl font-light text-ink mb-3">One more thing</h2>
                <p className="text-sm text-whisper mb-8">
                  Does {savedPersonName} have a partner attending the wedding?
                  {savedPersonSide && (
                    <span className="block mt-1 italic">{sideLabel(savedPersonSide)}</span>
                  )}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('partner_form')}
                    className="py-4 text-sm border border-plum text-plum hover:bg-plum hover:text-cream transition-colors"
                  >
                    Yes, add their partner
                  </button>
                  <button
                    type="button"
                    onClick={() => { reset(); setOpen(false) }}
                    className="py-4 text-sm border border-hairline text-whisper hover:border-mauve hover:text-ink transition-colors"
                  >
                    No, all done
                  </button>
                </div>
              </>
            )}

            {/* ── STEP: partner form ── */}
            {step === 'partner_form' && (
              <>
                <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Family</div>
                <h2 className="text-2xl font-light text-ink mb-2">
                  {savedPersonName}&apos;s partner
                </h2>
                <p className="text-sm text-whisper mb-8">
                  Add their details and we will make sure they are included on the day.
                </p>

                <form onSubmit={handlePartnerSubmit} className="space-y-6">

                  <div>
                    <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={partnerName}
                      onChange={e => setPartnerName(e.target.value)}
                      className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Mobile number</label>
                    <PhoneInput value={partnerPhone} onChange={setPartnerPhone} containerClass="w-full" />
                  </div>

                  <div>
                    <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Email address</label>
                    <input
                      type="email"
                      value={partnerEmail}
                      onChange={e => setPartnerEmail(e.target.value)}
                      className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] tracking-label uppercase text-whisper block mb-3">
                      Include them in the family photographs?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {([true, false] as const).map(val => (
                        <button
                          key={String(val)}
                          type="button"
                          onClick={() => setPartnerInPhotos(val)}
                          className={`py-3 text-sm border transition-colors ${
                            partnerInPhotos === val
                              ? 'border-plum bg-plum text-cream'
                              : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                          }`}
                        >
                          {val ? 'Yes' : 'No'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {partnerError && <p className="text-sm text-red-500">{partnerError}</p>}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={partnerSaving || !partnerName || partnerInPhotos === null}
                      className="flex-1 py-3 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-40"
                    >
                      {partnerSaving ? 'Saving...' : 'Add to circle'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { reset(); setOpen(false) }}
                      className="px-6 py-3 text-[11px] tracking-label uppercase border border-hairline text-whisper hover:border-mauve hover:text-ink transition-colors"
                    >
                      Skip
                    </button>
                  </div>

                </form>
              </>
            )}

          </div>
        </div>
      )}
    </>
  )
}

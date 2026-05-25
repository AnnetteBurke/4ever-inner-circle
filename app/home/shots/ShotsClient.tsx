'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────

type Person = {
  id: string
  name: string
  role: string | null
  family_relationship: string | null
  side: string | null
  in_family_photos: boolean
  is_family: boolean
}

type ShotRecord = {
  id: string
  label: string
  people: string | null
  notes: string | null
  status: string
  shot_type: string
  generated_id: string | null
}

type GeneratedShot = {
  id: string
  label: string
  people: string
  shot_type: string
}

type Props = {
  brideName: string
  groomName: string
  partner1Gender: string
  partner2Gender: string
  initialShots: ShotRecord[]
  people: Person[]
}

// ─── Relationship constants ───────────────────────────────────────────────────

const PARENT_RELATIONSHIPS = ['Mum', 'Dad', 'Step-mum', 'Step-dad']
const SIBLING_RELATIONSHIPS = ['Sister', 'Brother', 'Step-sister', 'Step-brother']
const SIBLING_PARTNER_RELATIONSHIPS = ['Sister-in-law', 'Brother-in-law', 'Partner']
const GRANDPARENT_RELATIONSHIPS = ['Grandmother', 'Grandfather', 'Step-grandmother', 'Step-grandfather']
const NIBLING_RELATIONSHIPS = ['Niece', 'Nephew']
const CHILD_RELATIONSHIPS = ['Son', 'Daughter']

const BRIDE_PARENT_ROLES = ['father_of_bride', 'mother_of_bride', 'parent_of_bride']
const GROOM_PARENT_ROLES = ['father_of_groom', 'mother_of_groom', 'parent_of_groom']

const LABEL_BY_RELATIONSHIP = new Set(['Mum', 'Dad', 'Step-mum', 'Step-dad'])

// ─── Helpers ─────────────────────────────────────────────────────────────────

function names(people: Person[]) {
  return people.map(p => p.name).join(', ')
}

function withCouple(couple: string, group: Person[]) {
  return group.length ? `${couple}, ${names(group)}` : couple
}

function withPerson(personName: string, group: Person[]) {
  return group.length ? `${personName}, ${names(group)}` : personName
}

function categorizeSide(people: Person[], side: 'partner_1' | 'partner_2', isPartner1Bride: boolean) {
  const onSide = people.filter(p => p.side === side)
  const parentRoles = side === 'partner_1' ? BRIDE_PARENT_ROLES : GROOM_PARENT_ROLES

  const parents = onSide.filter(p =>
    PARENT_RELATIONSHIPS.includes(p.family_relationship ?? '') ||
    parentRoles.includes(p.role ?? '')
  )
  const siblings = onSide.filter(p =>
    SIBLING_RELATIONSHIPS.includes(p.family_relationship ?? '') ||
    p.role === 'sibling'
  )
  const siblingPartners = onSide.filter(p =>
    SIBLING_PARTNER_RELATIONSHIPS.includes(p.family_relationship ?? '') && p.in_family_photos
  )
  const niblings = onSide.filter(p => NIBLING_RELATIONSHIPS.includes(p.family_relationship ?? ''))
  const grandparents = onSide.filter(p => GRANDPARENT_RELATIONSHIPS.includes(p.family_relationship ?? ''))

  return { parents, siblings, siblingPartners, niblings, grandparents }
}

function generateSuggestions(
  people: Person[],
  brideName: string,
  groomName: string,
): GeneratedShot[] {
  const shots: GeneratedShot[] = []
  const couple = `${brideName}, ${groomName}`

  const bride1 = categorizeSide(people, 'partner_1', true)
  const groom1 = categorizeSide(people, 'partner_2', false)
  const coupleChildren = people.filter(p => CHILD_RELATIONSHIPS.includes(p.family_relationship ?? ''))

  // ── 1. Couple with bride's parents ───────────────────────────────────────
  if (bride1.parents.length > 0) {
    shots.push({
      id: 'bride_parents',
      label: `Couple with ${brideName}'s parents`,
      people: withCouple(couple, bride1.parents),
      shot_type: 'family',
    })
  }

  // ── 2. Couple with both sets of parents ──────────────────────────────────
  if (bride1.parents.length > 0 && groom1.parents.length > 0) {
    shots.push({
      id: 'both_families_parents',
      label: 'Couple with both sets of parents',
      people: withCouple(couple, [...bride1.parents, ...groom1.parents]),
      shot_type: 'family',
    })
  }

  // ── 3. Couple with groom's parents ───────────────────────────────────────
  if (groom1.parents.length > 0) {
    shots.push({
      id: 'groom_parents',
      label: `Couple with ${groomName}'s parents`,
      people: withCouple(couple, groom1.parents),
      shot_type: 'family',
    })
  }

  // ── 4–7. Bride's family ──────────────────────────────────────────────────
  if (bride1.parents.length > 0 && bride1.siblings.length > 0) {
    shots.push({
      id: 'bride_full_family',
      label: `${brideName}'s full family`,
      people: withCouple(couple, [...bride1.parents, ...bride1.siblings, ...bride1.siblingPartners, ...bride1.niblings]),
      shot_type: 'family',
    })
    shots.push({
      id: 'bride_immediate_family',
      label: `${brideName}'s immediate family`,
      people: withPerson(brideName, [...bride1.parents, ...bride1.siblings]),
      shot_type: 'family',
    })
  }
  if (bride1.siblings.length > 0) {
    shots.push({
      id: 'bride_siblings',
      label: `${brideName}'s siblings`,
      people: withPerson(brideName, bride1.siblings),
      shot_type: 'family',
    })
  }
  if (bride1.parents.length > 0) {
    shots.push({
      id: 'bride_parents_alone',
      label: `${brideName}'s parents`,
      people: names(bride1.parents),
      shot_type: 'family',
    })
  }

  // ── 8–11. Groom's family ─────────────────────────────────────────────────
  if (groom1.parents.length > 0 && groom1.siblings.length > 0) {
    shots.push({
      id: 'groom_full_family',
      label: `${groomName}'s full family`,
      people: withCouple(couple, [...groom1.parents, ...groom1.siblings, ...groom1.siblingPartners, ...groom1.niblings]),
      shot_type: 'family',
    })
    shots.push({
      id: 'groom_immediate_family',
      label: `${groomName}'s immediate family`,
      people: withPerson(groomName, [...groom1.parents, ...groom1.siblings]),
      shot_type: 'family',
    })
  }
  if (groom1.siblings.length > 0) {
    shots.push({
      id: 'groom_siblings',
      label: `${groomName}'s siblings`,
      people: withPerson(groomName, groom1.siblings),
      shot_type: 'family',
    })
  }
  if (groom1.parents.length > 0) {
    shots.push({
      id: 'groom_parents_alone',
      label: `${groomName}'s parents`,
      people: names(groom1.parents),
      shot_type: 'family',
    })
  }

  // ── Grandparents ─────────────────────────────────────────────────────────
  if (bride1.grandparents.length > 0) {
    shots.push({
      id: 'bride_grandparents',
      label: `Couple with ${brideName}'s grandparents`,
      people: withCouple(couple, bride1.grandparents),
      shot_type: 'family',
    })
  }
  if (groom1.grandparents.length > 0) {
    shots.push({
      id: 'groom_grandparents',
      label: `Couple with ${groomName}'s grandparents`,
      people: withCouple(couple, groom1.grandparents),
      shot_type: 'family',
    })
  }

  // ── Couple's own children ─────────────────────────────────────────────────
  if (coupleChildren.length > 0) {
    shots.push({
      id: 'couple_children',
      label: 'Couple with their children',
      people: withCouple(couple, coupleChildren),
      shot_type: 'family',
    })
  }

  return shots
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ShotsClient({ brideName, groomName, partner1Gender, partner2Gender, initialShots, people }: Props) {
  const [shots, setShots] = useState<ShotRecord[]>(initialShots)
  const [customOpen, setCustomOpen] = useState(false)
  const [customLabel, setCustomLabel] = useState('')
  const [contactPersonId, setContactPersonId] = useState('')
  const [customNotes, setCustomNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [actioning, setActioning] = useState<string | null>(null)
  const [excluded, setExcluded] = useState<Record<string, string[]>>({})
  const [confirming, setConfirming] = useState<Record<string, string | null>>({})
  const [added, setAdded] = useState<Record<string, string[]>>({})
  const [addingTo, setAddingTo] = useState<string | null>(null)
  const [allPeople, setAllPeople] = useState(people)
  const [newPersonName, setNewPersonName] = useState('')
  const [newPersonRel, setNewPersonRel] = useState('')
  const [newPersonSide, setNewPersonSide] = useState('')
  const [savingNew, setSavingNew] = useState(false)

  function getPersonLabel(name: string): string {
    if (name === brideName) return brideName.split(' ')[0]
    if (name === groomName) return groomName.split(' ')[0]
    const person = allPeople.find(p => p.name === name)
    if (person?.family_relationship && LABEL_BY_RELATIONSHIP.has(person.family_relationship)) {
      return person.family_relationship
    }
    return name.split(' ')[0]
  }

  function handleChipClick(shotId: string, name: string) {
    if (confirming[shotId] === name) {
      setExcluded(prev => ({ ...prev, [shotId]: [...(prev[shotId] ?? []), name] }))
      setConfirming(prev => ({ ...prev, [shotId]: null }))
    } else {
      setConfirming(prev => ({ ...prev, [shotId]: name }))
    }
  }

  const approvedIds = new Set(shots.filter(s => s.generated_id && s.status === 'approved').map(s => s.generated_id!))
  const skippedIds = new Set(shots.filter(s => s.generated_id && s.status === 'skipped').map(s => s.generated_id!))
  const decidedIds = new Set([...approvedIds, ...skippedIds])

  const suggestions = generateSuggestions(people, brideName, groomName)
  const pending = suggestions.filter(s => !decidedIds.has(s.id))
  const approved = shots.filter(s => s.status === 'approved').sort((a, b) => {
    if (a.shot_type === 'family' && b.shot_type !== 'family') return -1
    if (a.shot_type !== 'family' && b.shot_type === 'family') return 1
    return 0
  })

  const familyInCircle = people.some(p =>
    p.is_family === true ||
    (p.family_relationship !== null && p.family_relationship !== '') ||
    BRIDE_PARENT_ROLES.includes(p.role ?? '') ||
    GROOM_PARENT_ROLES.includes(p.role ?? '')
  )
  const hasAnyPeople = people.length > 0

  async function handleDecide(shot: GeneratedShot, status: 'approved' | 'skipped', filteredPeople?: string) {
    setActioning(shot.id)
    const res = await fetch('/api/shots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: shot.label,
        people: filteredPeople !== undefined ? filteredPeople : shot.people,
        status,
        shot_type: shot.shot_type,
        generated_id: shot.id,
      }),
    })
    if (res.ok) {
      const saved = await res.json()
      setShots(prev => [...prev, saved])
    }
    setActioning(null)
  }

  async function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customLabel) return
    setSaving(true)
    const contactName = people.find(p => p.id === contactPersonId)?.name ?? null
    const res = await fetch('/api/shots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: customLabel,
        people: contactName,
        notes: customNotes || null,
        status: 'approved',
        shot_type: 'custom',
      }),
    })
    if (res.ok) {
      const saved = await res.json()
      setShots(prev => [...prev, saved])
      setCustomLabel(''); setContactPersonId(''); setCustomNotes('')
      setCustomOpen(false)
    }
    setSaving(false)
  }

  async function handleRemove(id: string) {
    await fetch(`/api/shots/${id}`, { method: 'DELETE' })
    setShots(prev => prev.filter(s => s.id !== id))
  }

  return (
    <main className="min-h-screen bg-cream">

      {/* Header — image behind plum overlay */}
      <div className="relative text-cream px-8 md:px-16 pt-8 md:pt-12 pb-8 md:pb-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/site-images/family-shots/00-family.jpg)` }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(74, 31, 61, 0.88)' }} />
        <div className="relative max-w-4xl mx-auto">
          <Link href="/home" className="text-[11px] tracking-label uppercase text-mauve-soft hover:text-cream transition-colors mb-6 block">
            ← Back to your Inner Circle
          </Link>
          <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">Photography</div>
          <h1 className="text-4xl md:text-5xl font-light text-cream leading-tight">Family Shot List</h1>
          <p className="text-cream/60 text-base mt-3 max-w-xl">
            Your family group shots, built from the people in <a href="/home/people" className="font-semibold text-cream underline underline-offset-2 hover:text-mauve-soft transition-colors">Our Circle</a>. Tick the combinations you want and we handle everything on the day.
          </p>
        </div>
      </div>

      {/* Image strip directly below header — mobile: 2 cols h-32, desktop: 4 flex h-80 */}
      <div className="md:hidden grid grid-cols-2 gap-0.5 h-32">
        <div className="overflow-hidden">
          <img
            src="https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/site-images/family-shots/01-family.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="overflow-hidden">
          <img
            src="https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/site-images/family-shots/02-family.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: '70% center' }}
          />
        </div>
      </div>
      <div className="hidden md:flex gap-0.5 h-80 overflow-hidden">
        {['01','02','extra','04'].map(n => (
          <div key={n} className="flex-1 overflow-hidden">
            <img
              src={`https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/site-images/family-shots/${n}-family.jpg`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-8 md:px-16 py-16 space-y-16">

        {/* Prerequisite nudge */}
        <div className="border border-mauve/40 bg-blush-soft px-8 py-8">
          <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Before you start</div>
          {!hasAnyPeople ? (
            <>
              <p className="text-base font-light text-ink mb-3">
                Head to <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a> and add your family before you come back here.
              </p>
              <p className="text-sm text-charcoal/70 leading-relaxed mb-5">
                We build your suggested shot list from exactly who you have added. Parents, siblings, step-parents, grandparents, nieces and nephews. The more detail you give us, the better your list will be.
              </p>
            </>
          ) : !familyInCircle ? (
            <>
              <p className="text-base font-light text-ink mb-3">
                Do you have everyone in <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a>?
              </p>
              <p className="text-sm text-charcoal/70 leading-relaxed mb-5">
                We can see people in your circle but the family relationships are not quite complete yet. Pop back to <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a>, make sure parents, siblings and grandparents are all in there, and your suggestions will appear below automatically.
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-light text-ink mb-3">
                You have <span className="font-semibold text-plum">{people.length}</span> {people.length === 1 ? 'person' : 'people'} in <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a>. Make sure everyone you want in the family photographs is in there, because we build your suggested lists from exactly who you have added.
              </p>
              <p className="text-sm text-charcoal/70 leading-relaxed mb-3">
                When all the family you want in the photographs are added, check back here and you will see a suggested list of combinations.
              </p>
              <p className="text-sm text-charcoal/70 leading-relaxed mb-3">
                Consider each combination. If someone is missing, click the <span className="font-semibold text-plum">Add another person</span> button. If you want to remove someone, click their name and you will have that option.
              </p>
              <p className="text-sm text-charcoal/70 leading-relaxed mb-5">
                We will WhatsApp everyone on the list a time and place to be, so that no one disappears to their room when they are supposed to be in front of the camera.
              </p>
            </>
          )}
          <Link
            href="/home/people"
            className="inline-block text-[11px] tracking-label uppercase bg-plum text-cream border border-plum px-6 py-3 hover:bg-plum/90 transition-colors"
          >
            Go to <strong>Our Circle</strong>
          </Link>
        </div>

        {/* Pending suggestions */}
        {pending.length > 0 && (
          <div>
            <div className="flex items-end justify-between border-b border-plum pb-4 mb-2">
              <h2 className="text-2xl font-light text-plum">Suggested shots</h2>
              <span className="text-[11px] tracking-label uppercase text-mauve-soft">{pending.length} remaining</span>
            </div>
            <p className="text-sm text-charcoal/70 leading-relaxed mb-8">
              Check each photo combination. You can add someone, click a name to remove them, then press Approve or skip the shot altogether.
            </p>
            <div className="space-y-4">
              {pending.map(shot => {
                const shotExcluded = excluded[shot.id] ?? []
                const addedNames = added[shot.id] ?? []
                const personNames = shot.people.split(', ')
                const allPersonNames = [...personNames, ...addedNames]
                const includedPeople = allPersonNames.filter(n => !shotExcluded.includes(n)).join(', ')
                const includedNames = allPersonNames.filter(n => !shotExcluded.includes(n))
                const includedSet = new Set(includedNames)
                const availableFromCircle = allPeople.filter(p => !includedSet.has(p.name))
                const isAddingHere = addingTo === shot.id
                return (
                  <div key={shot.id} className="border border-hairline px-6 py-6">
                    <p className="text-[11px] tracking-label uppercase text-mauve mb-4">{shot.label}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {includedNames.map(name => {
                        const isConfirming = confirming[shot.id] === name
                        const label = getPersonLabel(name)
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => handleChipClick(shot.id, name)}
                            className={`px-4 py-3 text-center min-w-[72px] transition-colors ${
                              isConfirming ? 'bg-cream border border-mauve' : 'bg-blush-soft'
                            }`}
                          >
                            <span className={`block text-[11px] tracking-label uppercase leading-tight ${isConfirming ? 'text-mauve' : 'text-plum'}`}>
                              {isConfirming ? 'Remove?' : label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleDecide(shot, 'approved', includedPeople)}
                        disabled={actioning === shot.id || includedPeople === ''}
                        className="py-3 px-2 text-[10px] tracking-label uppercase leading-tight text-center bg-plum text-cream hover:bg-plum/90 transition-colors disabled:opacity-40"
                      >
                        {actioning === shot.id ? 'Saving...' : 'Approve this image'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingTo(isAddingHere ? null : shot.id)}
                        className={`py-3 px-2 text-[10px] tracking-label uppercase leading-tight text-center border transition-colors ${
                          isAddingHere
                            ? 'border-mauve bg-mauve text-cream'
                            : 'border-mauve text-mauve hover:bg-mauve hover:text-cream'
                        }`}
                      >
                        Add another person
                      </button>
                      <button
                        onClick={() => handleDecide(shot, 'skipped')}
                        disabled={actioning === shot.id}
                        className="py-3 px-2 text-[10px] tracking-label uppercase leading-tight text-center border border-hairline text-whisper hover:border-mauve hover:text-ink transition-colors disabled:opacity-40"
                      >
                        Skip this shot
                      </button>
                    </div>

                    {/* Add-someone panel */}
                    {isAddingHere && (
                      <div className="border-t border-hairline mt-5 pt-5 space-y-5">

                        {/* From Our Circle */}
                        {availableFromCircle.length > 0 && (
                          <div>
                            <p className="text-[11px] tracking-label uppercase text-whisper mb-3">Already in Our Circle — tap to add to this shot</p>
                            <div className="flex flex-wrap gap-2">
                              {availableFromCircle.map(p => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => setAdded(prev => ({ ...prev, [shot.id]: [...(prev[shot.id] ?? []), p.name] }))}
                                  className="px-4 py-2.5 bg-cream border border-mauve text-[11px] tracking-label uppercase text-mauve hover:bg-mauve hover:text-cream transition-colors"
                                >
                                  + {p.family_relationship && LABEL_BY_RELATIONSHIP.has(p.family_relationship) ? p.family_relationship : p.name.split(' ')[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add someone brand new */}
                        <div>
                          <p className="text-[11px] tracking-label uppercase text-whisper mb-3">Add someone new to Our Circle</p>
                          <div className="flex flex-wrap gap-2 items-end">
                            <input
                              type="text"
                              value={newPersonName}
                              onChange={e => setNewPersonName(e.target.value)}
                              placeholder="Full name"
                              className="border border-hairline px-3 py-2.5 text-sm text-ink bg-transparent focus:outline-none focus:border-mauve"
                              style={{ width: '140px' }}
                            />
                            <div className="relative">
                              <select
                                value={newPersonRel}
                                onChange={e => setNewPersonRel(e.target.value)}
                                className="border border-hairline px-3 py-2.5 text-sm text-ink bg-cream focus:outline-none focus:border-mauve appearance-none pr-7"
                              >
                                <option value="">Relationship</option>
                                <option value="Mum">Mum</option>
                                <option value="Dad">Dad</option>
                                <option value="Step-mum">Step-mum</option>
                                <option value="Step-dad">Step-dad</option>
                                <option value="Sister">Sister</option>
                                <option value="Brother">Brother</option>
                                <option value="Sister-in-law">Sister-in-law</option>
                                <option value="Brother-in-law">Brother-in-law</option>
                                <option value="Grandmother">Grandmother</option>
                                <option value="Grandfather">Grandfather</option>
                                <option value="Aunt">Aunt</option>
                                <option value="Uncle">Uncle</option>
                              </select>
                              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-whisper text-xs">▾</span>
                            </div>
                            <div className="relative">
                              <select
                                value={newPersonSide}
                                onChange={e => setNewPersonSide(e.target.value)}
                                className="border border-hairline px-3 py-2.5 text-sm text-ink bg-cream focus:outline-none focus:border-mauve appearance-none pr-7"
                              >
                                <option value="">Whose side?</option>
                                <option value="partner_1">{brideName}&apos;s</option>
                                <option value="partner_2">{groomName}&apos;s</option>
                              </select>
                              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-whisper text-xs">▾</span>
                            </div>
                            <button
                              type="button"
                              disabled={!newPersonName.trim() || !newPersonRel || !newPersonSide || savingNew}
                              onClick={async () => {
                                setSavingNew(true)
                                const res = await fetch('/api/people', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    name: newPersonName.trim(),
                                    family_relationship: newPersonRel,
                                    side: newPersonSide,
                                    is_family: true,
                                  }),
                                })
                                if (res.ok) {
                                  const saved = await res.json()
                                  setAllPeople(prev => [...prev, saved])
                                  setAdded(prev => ({ ...prev, [shot.id]: [...(prev[shot.id] ?? []), newPersonName.trim()] }))
                                  setNewPersonName('')
                                  setNewPersonRel('')
                                  setNewPersonSide('')
                                }
                                setSavingNew(false)
                              }}
                              className="px-5 py-2.5 text-[11px] tracking-label uppercase bg-plum text-cream hover:bg-plum/90 transition-colors disabled:opacity-40"
                            >
                              {savingNew ? 'Adding...' : 'Add'}
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setAddingTo(null)}
                          className="text-[11px] tracking-label uppercase text-whisper hover:text-ink transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* All done with suggestions */}
        {familyInCircle && pending.length === 0 && suggestions.length > 0 && (
          <div className="border border-hairline px-8 py-8 text-center">
            <p className="text-sm text-ink font-light mb-1">All suggestions reviewed.</p>
            <p className="text-xs text-whisper italic">Use the section below to add any extra shots we haven't suggested.</p>
          </div>
        )}

        {/* Approved shot list */}
        {approved.length > 0 && (
          <div>
            <div className="border-b border-plum pb-4 mb-6">
              <h2 className="text-2xl font-light text-plum">Your confirmed shot list</h2>
            </div>
            <div className="border border-hairline divide-y divide-hairline">
              {approved.map((shot, i) => (
                <div key={shot.id} className="px-6 py-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-[11px] tracking-label uppercase text-mauve-soft w-6 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-base font-light text-ink">{shot.label}</p>
                        {shot.people && <p className="text-sm text-whisper mt-0.5">{shot.people}</p>}
                        {shot.notes && <p className="text-sm text-mauve italic mt-0.5">{shot.notes}</p>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(shot.id)}
                    className="text-[11px] tracking-label uppercase text-whisper hover:text-mauve transition-colors flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-whisper/60 mt-4 italic">
              {approved.length} shot{approved.length === 1 ? '' : 's'} confirmed. We will work through these in order on the day.
            </p>
          </div>
        )}


        {/* Extended family prompt */}
        <div className="border border-hairline px-8 py-8">
          <div className="text-[11px] tracking-label uppercase text-mauve mb-3">Extended family</div>
          <p className="text-base font-light text-ink mb-2">Do you want to include aunts, uncles, or cousins?</p>
          <p className="text-sm text-charcoal/70 leading-relaxed mb-4">
            If either of you has extended family you would love to include — a photo of your mum with her sisters, or a big cousins shot — add them into <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a> and they will appear in your suggestions. Remember, group photographs take time and we love gathering everyone, but make sure you pick the combinations that are important to you.
          </p>
          <Link
            href="/home/people"
            className="inline-block text-[11px] tracking-label uppercase bg-plum text-cream border border-plum px-5 py-2 hover:bg-plum/90 transition-colors"
          >
            Add extended family to <strong>Our Circle</strong>
          </Link>
        </div>

        {/* Friend groups and special requests */}
        <div>
          <div className="flex items-end justify-between border-b border-plum pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-light text-plum">Friends and special requests</h2>
            </div>
            <button
              onClick={() => setCustomOpen(true)}
              className="text-[11px] tracking-label uppercase bg-plum text-cream border border-plum px-5 py-2 hover:bg-plum/90 transition-colors flex-shrink-0 ml-6"
            >
              + Add shot
            </button>
          </div>

          <p className="text-sm text-whisper italic mb-6">
            School friends, university friends, work colleagues, godparents, football teammates — any specific group that matters to you. Add them here and we will make it happen.
          </p>

          {shots.filter(s => s.shot_type === 'custom' && s.status === 'approved').length === 0 ? (
            <div className="border border-hairline px-8 py-10 text-center">
              <p className="text-sm text-whisper italic">No custom shots added yet.</p>
            </div>
          ) : (
            <div className="border border-hairline divide-y divide-hairline">
              {shots.filter(s => s.shot_type === 'custom' && s.status === 'approved').map(shot => (
                <div key={shot.id} className="px-6 py-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-light text-ink mb-1">{shot.label}</p>
                    {shot.people && <p className="text-sm text-whisper">{shot.people}</p>}
                    {shot.notes && <p className="text-sm text-mauve italic mt-0.5">{shot.notes}</p>}
                  </div>
                  <button
                    onClick={() => handleRemove(shot.id)}
                    className="text-[11px] tracking-label uppercase text-whisper hover:text-mauve transition-colors flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Bottom image strip — desktop only */}
      <div className="hidden md:flex gap-0.5 h-80 overflow-hidden">
        {['05','06','07','08'].map(n => (
          <div key={n} className="flex-1 overflow-hidden">
            <img
              src={`https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/site-images/family-shots/${n}-family.jpg`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Custom shot modal */}
      {customOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setCustomOpen(false)} />
          <div className="relative bg-cream w-full max-w-md mx-auto px-8 py-10 max-h-[90vh] overflow-y-auto">
            <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Friends and special shots</div>
            <h2 className="text-2xl font-light text-ink mb-2">Add a shot</h2>
            <p className="text-sm text-whisper leading-relaxed mb-8">
              For each group, pick one person from <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a> as the contact. We will send them a WhatsApp 10 minutes before the shot with the exact location, and they gather everyone. This is the single biggest time-saver on the day.
            </p>
            <form onSubmit={handleCustomSubmit} className="space-y-6">
              <div>
                <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">What do you want to call this shot?</label>
                <input
                  type="text"
                  required
                  value={customLabel}
                  onChange={e => setCustomLabel(e.target.value)}
                  placeholder="e.g. All my school friends, The godparents, Dad and his best mate"
                  className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
                />
              </div>
              <div>
                <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Who should we contact to gather this group?</label>
                {people.length === 0 ? (
                  <div className="border border-dashed border-hairline px-4 py-4">
                    <p className="text-sm text-whisper italic mb-2">No one in Our Circle yet.</p>
                    <a href="/home/people" className="text-[11px] tracking-label uppercase text-mauve hover:text-ink transition-colors">Add people to Our Circle first</a>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <select
                        value={contactPersonId}
                        onChange={e => setContactPersonId(e.target.value)}
                        className="w-full border border-hairline px-4 py-3 text-sm text-ink bg-cream focus:outline-none focus:border-mauve appearance-none pr-8"
                      >
                        <option value="">Select a contact person</option>
                        {people.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-whisper text-xs">▾</span>
                    </div>
                    {!contactPersonId && (
                      <p className="text-xs text-whisper mt-1.5 italic">
                        If the right person isn&apos;t here yet, <a href="/home/people" className="text-mauve hover:text-ink transition-colors">add them to Our Circle</a> first.
                      </p>
                    )}
                  </>
                )}
              </div>
              <div>
                <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Anything else we should know? (optional)</label>
                <textarea
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. One person uses a wheelchair, this group will be at the drinks reception"
                  className="w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !customLabel}
                  className="flex-1 py-3 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-40"
                >
                  {saving ? 'Saving...' : 'Add to list'}
                </button>
                <button
                  type="button"
                  onClick={() => setCustomOpen(false)}
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

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
const SIBLING_PARTNER_RELATIONSHIPS = ['Sister-in-law', 'Brother-in-law']
const GRANDPARENT_RELATIONSHIPS = ['Grandmother', 'Grandfather', 'Step-grandmother', 'Step-grandfather']
const NIBLING_RELATIONSHIPS = ['Niece', 'Nephew']
const CHILD_RELATIONSHIPS = ['Son', 'Daughter']

const BRIDE_PARENT_ROLES = ['father_of_bride', 'mother_of_bride', 'parent_of_bride']
const GROOM_PARENT_ROLES = ['father_of_groom', 'mother_of_groom', 'parent_of_groom']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function names(people: Person[]) {
  return people.map(p => p.name).join(', ')
}

function withCouple(couple: string, group: Person[]) {
  return group.length ? `${couple}, ${names(group)}` : couple
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
  const couple = `${brideName} and ${groomName}`

  const bride1 = categorizeSide(people, 'partner_1', true)
  const groom1 = categorizeSide(people, 'partner_2', false)
  const coupleChildren = people.filter(p => CHILD_RELATIONSHIPS.includes(p.family_relationship ?? ''))

  // ── 1. Both families together ──────────────────────────────────────────────
  if (bride1.parents.length > 0 && groom1.parents.length > 0) {
    shots.push({
      id: 'both_families_parents',
      label: 'Both families: couple with both sets of parents',
      people: withCouple(couple, [...bride1.parents, ...groom1.parents]),
      shot_type: 'family',
    })
  }

  // ── 2–7. Bride's side ──────────────────────────────────────────────────────
  if (bride1.parents.length > 0) {
    shots.push({
      id: 'bride_parents',
      label: `${brideName}'s parents`,
      people: withCouple(couple, bride1.parents),
      shot_type: 'family',
    })

    if (bride1.siblings.length > 0) {
      const fullFamily = [...bride1.parents, ...bride1.siblings, ...bride1.siblingPartners, ...bride1.niblings]
      shots.push({
        id: 'bride_full_family',
        label: `${brideName}'s full family`,
        people: withCouple(couple, fullFamily),
        shot_type: 'family',
      })

      if (bride1.siblingPartners.length > 0 || bride1.niblings.length > 0) {
        shots.push({
          id: 'bride_parents_siblings',
          label: `${brideName}'s parents and siblings`,
          people: withCouple(couple, [...bride1.parents, ...bride1.siblings]),
          shot_type: 'family',
        })
      }

      // Parents with all their children — bride included, groom removed
      shots.push({
        id: 'bride_parents_with_children',
        label: `${brideName}'s parents with all their children`,
        people: names([...bride1.parents, { id: 'bride', name: brideName } as Person, ...bride1.siblings]),
        shot_type: 'family',
      })

      // B&G with siblings only
      shots.push({
        id: 'bride_siblings',
        label: `${brideName}'s siblings`,
        people: withCouple(couple, bride1.siblings),
        shot_type: 'family',
      })
    }

    if (bride1.parents.length >= 2) {
      shots.push({
        id: 'bride_parents_alone',
        label: `${brideName}'s parents alone`,
        people: names(bride1.parents),
        shot_type: 'family',
      })
    }
  }

  // ── 8–13. Groom's side ────────────────────────────────────────────────────
  if (groom1.parents.length > 0) {
    shots.push({
      id: 'groom_parents',
      label: `${groomName}'s parents`,
      people: withCouple(couple, groom1.parents),
      shot_type: 'family',
    })

    if (groom1.siblings.length > 0) {
      const fullFamily = [...groom1.parents, ...groom1.siblings, ...groom1.siblingPartners, ...groom1.niblings]
      shots.push({
        id: 'groom_full_family',
        label: `${groomName}'s full family`,
        people: withCouple(couple, fullFamily),
        shot_type: 'family',
      })

      if (groom1.siblingPartners.length > 0 || groom1.niblings.length > 0) {
        shots.push({
          id: 'groom_parents_siblings',
          label: `${groomName}'s parents and siblings`,
          people: withCouple(couple, [...groom1.parents, ...groom1.siblings]),
          shot_type: 'family',
        })
      }

      shots.push({
        id: 'groom_parents_with_children',
        label: `${groomName}'s parents with all their children`,
        people: names([...groom1.parents, { id: 'groom', name: groomName } as Person, ...groom1.siblings]),
        shot_type: 'family',
      })

      shots.push({
        id: 'groom_siblings',
        label: `${groomName}'s siblings`,
        people: withCouple(couple, groom1.siblings),
        shot_type: 'family',
      })
    }

    if (groom1.parents.length >= 2) {
      shots.push({
        id: 'groom_parents_alone',
        label: `${groomName}'s parents alone`,
        people: names(groom1.parents),
        shot_type: 'family',
      })
    }
  }

  // ── Grandparents ──────────────────────────────────────────────────────────
  if (bride1.grandparents.length > 0) {
    shots.push({
      id: 'bride_grandparents',
      label: `${brideName}'s grandparents`,
      people: withCouple(couple, bride1.grandparents),
      shot_type: 'family',
    })
  }
  if (groom1.grandparents.length > 0) {
    shots.push({
      id: 'groom_grandparents',
      label: `${groomName}'s grandparents`,
      people: withCouple(couple, groom1.grandparents),
      shot_type: 'family',
    })
  }
  if (bride1.grandparents.length > 0 && groom1.grandparents.length > 0) {
    shots.push({
      id: 'all_grandparents',
      label: 'All grandparents together',
      people: withCouple(couple, [...bride1.grandparents, ...groom1.grandparents]),
      shot_type: 'family',
    })
  }

  // ── Nieces, nephews, couple's children ───────────────────────────────────
  const allNiblings = [...bride1.niblings, ...groom1.niblings]
  if (allNiblings.length > 0) {
    shots.push({
      id: 'all_niblings',
      label: 'All the little ones together',
      people: names(allNiblings),
      shot_type: 'family',
    })
    shots.push({
      id: 'niblings_with_couple',
      label: 'Couple with all the nieces and nephews',
      people: withCouple(couple, allNiblings),
      shot_type: 'family',
    })
  }

  if (coupleChildren.length > 0) {
    shots.push({
      id: 'couple_children',
      label: "Couple with their children",
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
    p.is_family || PARENT_RELATIONSHIPS.includes(p.family_relationship ?? '') ||
    SIBLING_RELATIONSHIPS.includes(p.family_relationship ?? '') ||
    BRIDE_PARENT_ROLES.includes(p.role ?? '') || GROOM_PARENT_ROLES.includes(p.role ?? '')
  )

  async function handleDecide(shot: GeneratedShot, status: 'approved' | 'skipped') {
    setActioning(shot.id)
    const res = await fetch('/api/shots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: shot.label,
        people: shot.people,
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

      {/* Header */}
      <div className="bg-plum text-cream px-8 md:px-16 pt-12 pb-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/home" className="text-[11px] tracking-label uppercase text-mauve-soft hover:text-cream transition-colors mb-6 block">
            ← Back to your Inner Circle
          </Link>
          <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">Photography</div>
          <h1 className="text-4xl md:text-5xl font-light text-cream leading-tight">Family Shot List</h1>
          <p className="text-cream/60 text-base mt-3 max-w-xl">
            We build your family group shots from the people you add to <a href="/home/people" className="font-semibold text-cream underline underline-offset-2 hover:text-mauve-soft transition-colors">Our Circle</a>. Make your way there and add everyone you want included in your photo list, then come back here and tick the combinations you want. We make sure everyone knows where they need to be by sending them a WhatsApp message 10 minutes beforehand with the location details.
          </p>
        </div>
      </div>

      {/* Family image strip — 4 photos full bleed */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
        {['00','01','02','03'].map(n => (
          <div key={n} className="overflow-hidden">
            <img
              src={`https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/site-images/family-shots/${n}-family.jpg`}
              alt=""
              className="w-full h-56 md:h-72 object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-8 md:px-16 py-16 space-y-16">

        {/* Prerequisite nudge — shown always, content changes based on count */}
        <div className="border border-mauve/40 bg-blush-soft px-8 py-8">
          <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Before you start</div>
          {!familyInCircle ? (
            <>
              <p className="text-base font-light text-ink mb-2">
                <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a> doesn&apos;t have any family members yet.
              </p>
              <p className="text-sm text-charcoal/70 leading-relaxed mb-5">
                To build your family shot list, we need to know who is coming. Add parents, siblings, step-parents, grandparents, nieces and nephews into <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a> first. The more detail you add, the more accurate your shot list will be.
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-light text-ink mb-2">
                You have <span className="font-semibold text-plum">{people.length}</span> {people.length === 1 ? 'person' : 'people'} in <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a>.
              </p>
              <p className="text-sm text-charcoal/70 leading-relaxed mb-5">
                If you want more people included in your shot list, add them to <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a> first and the suggestions here will update automatically.
              </p>
            </>
          )}
          <Link
            href="/home/people"
            className="inline-block text-[11px] tracking-label uppercase border border-plum text-plum px-6 py-3 hover:bg-plum hover:text-cream transition-colors"
          >
            Add more people to <strong>Our Circle</strong>
          </Link>
        </div>

        {/* Pending suggestions */}
        {pending.length > 0 && (
          <div>
            <div className="flex items-end justify-between border-b border-plum pb-4 mb-2">
              <h2 className="text-2xl font-light text-plum">Suggested shots</h2>
              <span className="text-[11px] tracking-label uppercase text-mauve-soft">{pending.length} remaining</span>
            </div>
            <p className="text-sm text-whisper italic mb-8">
              Based on the people in <a href="/home/people" className="font-semibold text-ink hover:text-mauve transition-colors">Our Circle</a>. Include the ones you want and skip the rest. Remember to ask your parents if there are any they would love themselves — this is a family day too.
            </p>
            <div className="space-y-3">
              {pending.map(shot => (
                <div key={shot.id} className="border border-hairline px-6 py-5">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-light text-ink mb-1">{shot.label}</p>
                      <p className="text-sm text-whisper">{shot.people}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleDecide(shot, 'approved')}
                        disabled={actioning === shot.id}
                        className="text-[11px] tracking-label uppercase px-5 py-2 bg-plum text-cream hover:bg-plum/80 transition-colors disabled:opacity-40"
                      >
                        Include
                      </button>
                      <button
                        onClick={() => handleDecide(shot, 'skipped')}
                        disabled={actioning === shot.id}
                        className="text-[11px] tracking-label uppercase px-5 py-2 border border-hairline text-whisper hover:border-mauve hover:text-ink transition-colors disabled:opacity-40"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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

      </div>

      {/* Image break — 3 photos, full bleed */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-0.5">
        {['04','05','06'].map(n => (
          <div key={n} className="overflow-hidden">
            <img
              src={`https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/site-images/family-shots/${n}-family.jpg`}
              alt=""
              className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-8 md:px-16 py-16 space-y-16">

        {/* Extended family prompt */}
        <div className="border border-hairline px-8 py-8">
          <div className="text-[11px] tracking-label uppercase text-mauve mb-3">Extended family</div>
          <p className="text-base font-light text-ink mb-2">Do you want to include aunts, uncles, or cousins?</p>
          <p className="text-sm text-charcoal/70 leading-relaxed mb-4">
            If either of you has extended family you would love to include — a photo of your mum with her sisters, or a big cousins shot — add them into <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a> and they will appear in your suggestions. Remember, group photographs take time and we love gathering everyone, but make sure you pick the combinations that are important to you.
          </p>
          <Link
            href="/home/people"
            className="inline-block text-[11px] tracking-label uppercase border border-hairline text-whisper px-5 py-2 hover:border-mauve hover:text-ink transition-colors"
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
              className="text-[11px] tracking-label uppercase text-mauve border border-mauve px-5 py-2 hover:bg-mauve hover:text-cream transition-colors flex-shrink-0 ml-6"
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

      {/* Final image pair */}
      <div className="grid grid-cols-2 gap-0.5">
        {['07','08'].map(n => (
          <div key={n} className="overflow-hidden">
            <img
              src={`https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/site-images/family-shots/${n}-family.jpg`}
              alt=""
              className="w-full h-64 md:h-96 object-cover hover:scale-105 transition-transform duration-700"
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

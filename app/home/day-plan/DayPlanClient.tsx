'use client'

import { useState } from 'react'
import Link from 'next/link'

type DayPlan = {
  photographer_count: number | null
  guest_count: number | null
  bride_prep_address: string | null
  bride_has_children: boolean | null
  bride_children_details: string | null
  bride_dad_reveal: boolean | null
  bride_bridesmaids_reveal: boolean | null
  bride_gifts: boolean | null
  bride_gifts_notes: string | null
  bride_prep_location_notes: string | null
  bride_pub_stop: boolean | null
  bride_pub_address: string | null
  bride_personality_notes: string | null
  groom_prep_address: string | null
  groom_has_children: boolean | null
  groom_children_details: string | null
  groom_personality_notes: string | null
  groom_pub_stop: boolean | null
  groom_pub_address: string | null
  groom_dad_reveal: boolean | null
  groom_bridesmaids_reveal: boolean | null
  groom_gifts: boolean | null
  groom_gifts_notes: string | null
  groom_prep_location_notes: string | null
  getting_ready_together: boolean | null
  aisle_entrance_style: string | null
  aisle_entrance_notes: string | null
  ceremony_special_moments: string | null
  celebrant_notes: string | null
  altar_shot: boolean | null
  post_ceremony_style: string | null
  ceremony_dip: boolean | null
  confetti: boolean | null
  confetti_notes: string | null
  special_visit: boolean | null
  special_visit_address: string | null
  special_visit_notes: string | null
  post_ceremony_refreshments: boolean | null
  post_ceremony_refreshments_notes: string | null
  photo_shoot_address: string | null
  photo_shoot_attendees: string | null
  photo_shoot_notes: string | null
  room_entrance_style: string | null
  room_entrance_notes: string | null
  speeches_timing: string | null
  speeches_speakers: string | null
  speeches_notes: string | null
  meal_entertainment: boolean | null
  meal_entertainment_notes: string | null
  first_dance_style: string | null
  first_dance_choreographed: boolean | null
  first_dance_notes: string | null
  daddy_daughter_dance: boolean | null
  second_dress: boolean | null
  second_dress_notes: string | null
  evening_outdoor_shots: boolean | null
  evening_outdoor_notes: string | null
  sparklers_fireworks: boolean | null
  sparklers_fireworks_type: string | null
  sparklers_who: string | null
  first_songs: string | null
  leaving_outfit_change: boolean | null
  leaving_outfit_change_notes: string | null
}

type CirclePerson = {
  id: string
  name: string
  role: string | null
  phone: string | null
  email: string | null
}

type Props = {
  brideName: string
  groomName: string
  partner1Gender: 'woman' | 'man'
  partner2Gender: 'woman' | 'man'
  photographerCount: 1 | 2
  initialPlan: DayPlan | null
  people: CirclePerson[]
}

const EMPTY: DayPlan = {
  photographer_count: null,
  guest_count: null,
  bride_prep_address: null,
  bride_has_children: null,
  bride_children_details: null,
  bride_dad_reveal: null,
  bride_bridesmaids_reveal: null,
  bride_gifts: null,
  bride_gifts_notes: null,
  bride_prep_location_notes: null,
  bride_pub_stop: null,
  bride_pub_address: null,
  bride_personality_notes: null,
  groom_prep_address: null,
  groom_has_children: null,
  groom_children_details: null,
  groom_personality_notes: null,
  groom_pub_stop: null,
  groom_pub_address: null,
  groom_dad_reveal: null,
  groom_bridesmaids_reveal: null,
  groom_gifts: null,
  groom_gifts_notes: null,
  groom_prep_location_notes: null,
  getting_ready_together: null,
  aisle_entrance_style: null,
  aisle_entrance_notes: null,
  ceremony_special_moments: null,
  celebrant_notes: null,
  altar_shot: null,
  post_ceremony_style: null,
  ceremony_dip: null,
  confetti: null,
  confetti_notes: null,
  special_visit: null,
  special_visit_address: null,
  special_visit_notes: null,
  post_ceremony_refreshments: null,
  post_ceremony_refreshments_notes: null,
  photo_shoot_address: null,
  photo_shoot_attendees: null,
  photo_shoot_notes: null,
  room_entrance_style: null,
  room_entrance_notes: null,
  speeches_timing: null,
  speeches_speakers: null,
  speeches_notes: null,
  meal_entertainment: null,
  meal_entertainment_notes: null,
  first_dance_style: null,
  first_dance_choreographed: null,
  first_dance_notes: null,
  daddy_daughter_dance: null,
  second_dress: null,
  second_dress_notes: null,
  evening_outdoor_shots: null,
  evening_outdoor_notes: null,
  sparklers_fireworks: null,
  sparklers_fireworks_type: null,
  sparklers_who: null,
  first_songs: null,
  leaving_outfit_change: null,
  leaving_outfit_change_notes: null,
}

function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 max-w-xs">
      {([true, false] as const).map(opt => (
        <button
          key={String(opt)}
          type="button"
          onClick={() => onChange(opt)}
          className={`py-3 text-sm border transition-colors ${
            value === opt
              ? 'border-plum bg-plum text-cream'
              : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
          }`}
        >
          {opt ? 'Yes' : 'No'}
        </button>
      ))}
    </div>
  )
}

function Toggle3<T extends string>({
  value, onChange, options,
}: {
  value: T | null
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div className={`grid gap-3 max-w-lg`} style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`py-3 text-sm border transition-colors ${
            value === opt.value
              ? 'border-plum bg-plum text-cream'
              : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function parseSpeakers(json: string | null): string[] {
  if (!json) return []
  try { return JSON.parse(json) } catch { return [] }
}

function toggleSpeaker(current: string | null, id: string): string {
  const arr = parseSpeakers(current)
  return arr.includes(id)
    ? JSON.stringify(arr.filter(s => s !== id))
    : JSON.stringify([...arr, id])
}

type ChildEntry = { name: string; age: string }

function parseChildren(json: string | null): ChildEntry[] {
  const base: ChildEntry[] = [{ name: '', age: '' }, { name: '', age: '' }, { name: '', age: '' }]
  if (!json) return base
  try {
    const parsed = JSON.parse(json) as ChildEntry[]
    while (parsed.length < 3) parsed.push({ name: '', age: '' })
    return parsed.slice(0, 3)
  } catch {
    return base
  }
}

function Q({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-[11px] tracking-label uppercase text-whisper block">{label}</label>
        {hint && <p className="text-xs text-whisper/60 mt-1 italic">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] tracking-label uppercase text-whisper block">{label}</label>
      {hint && <p className="text-xs text-whisper/60 italic">{hint}</p>}
      {children}
    </div>
  )
}

// Full-bleed section banner — swap imageUrl to a real photo when ready
function SectionBanner({
  number, title, subtitle, imageUrl,
}: {
  number: string
  title: string
  subtitle?: string
  imageUrl: string
}) {
  return (
    <div className="relative h-56 md:h-80 overflow-hidden">
      <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-plum/65" />
      <div className="absolute inset-x-0 bottom-0">
        <div className="max-w-4xl mx-auto px-8 md:px-16 pb-8">
          <div className="text-[10px] tracking-label uppercase text-mauve-soft mb-2">{number}</div>
          <h2 className="text-3xl md:text-4xl font-light text-cream">{title}</h2>
          {subtitle && <p className="text-sm text-cream/65 mt-2 max-w-xl">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

const inputClass = "w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve"
const textareaClass = "w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve resize-none"

export default function DayPlanClient({ brideName, groomName, partner1Gender, partner2Gender, photographerCount, initialPlan, people }: Props) {
  const [plan, setPlan] = useState<DayPlan>(() => {
    const base = { ...EMPTY, photographer_count: photographerCount }
    if (!initialPlan) return base
    const merged = { ...base }
    for (const key of Object.keys(EMPTY) as Array<keyof DayPlan>) {
      const val = initialPlan[key]
      if (val !== null && val !== undefined) {
        (merged as Record<string, unknown>)[key] = val
      }
    }
    merged.photographer_count = photographerCount
    return merged
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof DayPlan>(key: K, value: DayPlan[K]) {
    setPlan(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const res = await fetch('/api/day-plan', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    })
    if (!res.ok) {
      const d = await res.json()
      setError(d.error || 'Something went wrong')
    } else {
      setSaved(true)
    }
    setSaving(false)
  }

  const twoPhotographers = photographerCount === 2
  const partner1IsMale = partner1Gender === 'man'
  const partner2IsFemale = partner2Gender === 'woman'
  const twoGrooms = partner1Gender === 'man' && partner2Gender === 'man'
  const twoBrides = partner1Gender === 'woman' && partner2Gender === 'woman'

  const speakerIds = parseSpeakers(plan.speeches_speakers)
  const allSpeakerOptions = [
    { id: 'partner_1', name: brideName },
    { id: 'partner_2', name: groomName },
    ...people,
  ]

  return (
    <main className="min-h-screen bg-cream">

      {/* Page header */}
      <div className="bg-plum text-cream px-8 md:px-16 pt-12 pb-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/home" className="text-[11px] tracking-label uppercase text-mauve-soft hover:text-cream transition-colors mb-6 block">
            ← Back to your Inner Circle
          </Link>
          <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">Your day</div>
          <h1 className="text-4xl md:text-5xl font-light text-cream leading-tight">The Vision for Your Day</h1>
          <p className="text-cream/60 text-base mt-3 max-w-xl">
            Help us see the vision for your day. The more you share, the more we can anticipate every moment and make sure nothing is missed.
          </p>
        </div>
      </div>

      {/* ── SECTION 01: Package ── */}
      <SectionBanner
        number="01"
        title="Your Team"
        imageUrl="/sections/01-package.jpg"
      />
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-12 space-y-10">

        <div className="border border-hairline px-6 py-5 bg-blush-soft max-w-lg">
          <p className="text-sm text-ink font-light">
            {twoPhotographers
              ? `You have two photographers on your day. We will be with both of you from the morning so nothing is missed.`
              : `You have one photographer on your day. We will meet ${groomName} at the ceremony location 30 minutes before it begins, so there is no need to fill in anything for the ${groomName.split(' ')[0]}'s morning.`
            }
          </p>
        </div>

        <Q
          label="How many guests are attending?"
          hint="A rough number is absolutely fine at this stage. We just need a sense of the day."
        >
          <input
            type="number"
            min={1}
            value={plan.guest_count ?? ''}
            onChange={e => set('guest_count', e.target.value ? Number(e.target.value) : null)}
            className={`${inputClass} max-w-xs`}
            placeholder="e.g. 120"
          />
        </Q>

      </div>

      {/* ── SECTION 02: Bride's Morning ── */}
      <SectionBanner
        number="02"
        title={!twoGrooms && !twoBrides ? `${brideName}'s Morning` : plan.getting_ready_together ? `Your Morning Together` : `${brideName}'s Morning`}
        imageUrl="/sections/02-bride-morning.jpg"
      />
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-12 space-y-10">

        {(twoGrooms || twoBrides) && (
          <Q
            label="Are you getting ready together on the morning?"
            hint="Many same-sex couples get ready in the same location. If you are, we only need one set of morning details."
          >
            <YesNo value={plan.getting_ready_together} onChange={v => set('getting_ready_together', v)} />
          </Q>
        )}

        <Field
          label="Where are you getting ready?"
          hint="Full address and postcode please — the postcode is essential for us to plan travel times accurately."
        >
          <textarea
            value={plan.bride_prep_address ?? ''}
            onChange={e => set('bride_prep_address', e.target.value || null)}
            rows={3}
            className={textareaClass}
            placeholder="e.g. 14 Lakeview Road, Enniskillen, BT74 5AB"
          />
        </Field>

        <Q label="Do you have sons or daughters with you that morning?">
          <YesNo value={plan.bride_has_children} onChange={v => set('bride_has_children', v)} />
        </Q>

        {plan.bride_has_children && (
          <>
            <Field label="Tell us their names and ages" hint="Add up to three children. Leave blank if fewer.">
              <div className="space-y-3 max-w-sm">
                {parseChildren(plan.bride_children_details).map((child, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={child.name}
                      onChange={e => {
                        const children = parseChildren(plan.bride_children_details)
                        children[i] = { ...children[i], name: e.target.value }
                        set('bride_children_details', JSON.stringify(children))
                      }}
                      className={inputClass}
                      placeholder={`Child ${i + 1} name`}
                    />
                    <input
                      type="text"
                      value={child.age}
                      onChange={e => {
                        const children = parseChildren(plan.bride_children_details)
                        children[i] = { ...children[i], age: e.target.value }
                        set('bride_children_details', JSON.stringify(children))
                      }}
                      className={inputClass}
                      placeholder="Age"
                    />
                  </div>
                ))}
              </div>
            </Field>
            <div className="border border-hairline border-dashed px-5 py-4 max-w-lg">
              <p className="text-[11px] text-whisper italic">
                Any additional needs or considerations for your children can be noted in{' '}
                <a href="/home/people" className="text-mauve underline underline-offset-2">&ldquo;Our Circle&rdquo;</a>
                {' '}— we check those for every person when planning your day.
              </p>
            </div>
          </>
        )}

        {!partner1IsMale && (
          <>
            <Q
              label={twoBrides ? "Are you doing a parent reveal?" : "Are you doing a reveal to your dad?"}
              hint="We will make sure you are ready and we are in the right position before he walks in."
            >
              <YesNo value={plan.bride_dad_reveal} onChange={v => set('bride_dad_reveal', v)} />
            </Q>

            <Q
              label={twoBrides ? "Are your bridal party seeing you for the first time?" : "Are you doing a bridesmaids reveal?"}
              hint="If your girls have not seen the dress, let us know and we will capture the first look."
            >
              <YesNo value={plan.bride_bridesmaids_reveal} onChange={v => set('bride_bridesmaids_reveal', v)} />
            </Q>
          </>
        )}

        {partner1IsMale && (
          <>
            <Q label="Are the lads heading to the pub before the ceremony?">
              <YesNo value={plan.bride_pub_stop} onChange={v => set('bride_pub_stop', v)} />
            </Q>

            {plan.bride_pub_stop && (
              <Field
                label="Name and address of the pub"
                hint="We need this so the photographer and cars know exactly where to go."
              >
                <input
                  type="text"
                  value={plan.bride_pub_address ?? ''}
                  onChange={e => set('bride_pub_address', e.target.value || null)}
                  className={inputClass}
                  placeholder="e.g. The Crown Bar, 46 Great Victoria Street, Belfast, BT2 7BA"
                />
              </Field>
            )}

            <Field
              label="Anything about his personality or interests we should know?"
              hint="Tractors, horses, racing cars, whiskey — if it is part of who he is, tell us and we will capture it."
            >
              <textarea
                value={plan.bride_personality_notes ?? ''}
                onChange={e => set('bride_personality_notes', e.target.value || null)}
                rows={3}
                className={textareaClass}
                placeholder="e.g. He is a farmer and wants shots with his groomsmen in the fields with their hunter wellies"
              />
            </Field>
          </>
        )}

        <Q label="Are you giving special gifts to anyone that morning that you want us to capture?">
          <YesNo value={plan.bride_gifts} onChange={v => set('bride_gifts', v)} />
        </Q>

        {plan.bride_gifts && (
          <Field label="Tell us about the gifts" hint="Who are they for, and are there cards or emotional moments we should be ready for?">
            <textarea
              value={plan.bride_gifts_notes ?? ''}
              onChange={e => set('bride_gifts_notes', e.target.value || null)}
              rows={3}
              className={textareaClass}
              placeholder="e.g. Personalised cufflinks for Dad, photobook of memories for the bridesmaids"
            />
          </Field>
        )}

        <Field
          label="Is there anywhere special at your prep location you would love photos?"
          hint="A favourite room, a garden, somewhere with a memory attached."
        >
          <textarea
            value={plan.bride_prep_location_notes ?? ''}
            onChange={e => set('bride_prep_location_notes', e.target.value || null)}
            rows={2}
            className={textareaClass}
            placeholder="e.g. The old tyre swing in the garden, the treehouse I grew up in, the window seat in Mum's room"
          />
        </Field>

      </div>

      {/* ── SECTION 03: Second partner's Morning (2 photographers, not getting ready together) ── */}
      {twoPhotographers && !plan.getting_ready_together && (
        <>
          <SectionBanner
            number="03"
            title={`${groomName}'s Morning`}
            subtitle="With two photographers, we will be with you both at the same time."
            imageUrl="/sections/03-groom-morning.jpg"
          />
          <div className="max-w-4xl mx-auto px-8 md:px-16 py-12 space-y-10">

            <Field
              label="Where is the groom getting ready?"
              hint="Full address and postcode please — the postcode is essential for us to plan travel times accurately."
            >
              <textarea
                value={plan.groom_prep_address ?? ''}
                onChange={e => set('groom_prep_address', e.target.value || null)}
                rows={3}
                className={textareaClass}
                placeholder="e.g. 8 Church Street, Lisnaskea, BT92 0JD"
              />
            </Field>

            <Q label="Does the groom have sons or daughters with him that morning?">
              <YesNo value={plan.groom_has_children} onChange={v => set('groom_has_children', v)} />
            </Q>

            {plan.groom_has_children && (
              <>
                <Field label="Tell us their names and ages" hint="Add up to three children. Leave blank if fewer.">
                  <div className="space-y-3 max-w-sm">
                    {parseChildren(plan.groom_children_details).map((child, i) => (
                      <div key={i} className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={child.name}
                          onChange={e => {
                            const children = parseChildren(plan.groom_children_details)
                            children[i] = { ...children[i], name: e.target.value }
                            set('groom_children_details', JSON.stringify(children))
                          }}
                          className={inputClass}
                          placeholder={`Child ${i + 1} name`}
                        />
                        <input
                          type="text"
                          value={child.age}
                          onChange={e => {
                            const children = parseChildren(plan.groom_children_details)
                            children[i] = { ...children[i], age: e.target.value }
                            set('groom_children_details', JSON.stringify(children))
                          }}
                          className={inputClass}
                          placeholder="Age"
                        />
                      </div>
                    ))}
                  </div>
                </Field>
                <div className="border border-hairline border-dashed px-5 py-4 max-w-lg">
                  <p className="text-[11px] text-whisper italic">
                    Any additional needs or considerations for your children can be noted in{' '}
                    <a href="/home/people" className="text-mauve underline underline-offset-2">&ldquo;Our Circle&rdquo;</a>
                    {' '}— we check those for every person when planning your day.
                  </p>
                </div>
              </>
            )}

            {partner2IsFemale ? (
              <>
                <Q
                  label={twoBrides ? "Are you doing a parent reveal?" : "Are you doing a reveal to your dad?"}
                  hint="We will make sure you are ready and we are in the right position before he walks in."
                >
                  <YesNo value={plan.groom_dad_reveal} onChange={v => set('groom_dad_reveal', v)} />
                </Q>

                <Q
                  label="Are your bridal party seeing you for the first time?"
                  hint="If your girls have not seen the dress, let us know and we will capture the first look."
                >
                  <YesNo value={plan.groom_bridesmaids_reveal} onChange={v => set('groom_bridesmaids_reveal', v)} />
                </Q>
              </>
            ) : (
              <>
                <Q label="Are the lads heading to the pub before the ceremony?">
                  <YesNo value={plan.groom_pub_stop} onChange={v => set('groom_pub_stop', v)} />
                </Q>

                {plan.groom_pub_stop && (
                  <Field
                    label="Name and address of the pub"
                    hint="We need this so the photographer and cars know exactly where to go."
                  >
                    <input
                      type="text"
                      value={plan.groom_pub_address ?? ''}
                      onChange={e => set('groom_pub_address', e.target.value || null)}
                      className={inputClass}
                      placeholder="e.g. The Crown Bar, 46 Great Victoria Street, Belfast, BT2 7BA"
                    />
                  </Field>
                )}

                <Field
                  label="Anything about his personality or interests we should know?"
                  hint="Tractors, horses, racing cars, whiskey, a football match in the field — if it is part of who he is, tell us and we will capture it."
                >
                  <textarea
                    value={plan.groom_personality_notes ?? ''}
                    onChange={e => set('groom_personality_notes', e.target.value || null)}
                    rows={3}
                    className={textareaClass}
                    placeholder="e.g. He is a farmer and wants shots with his groomsmen in the fields with their hunter wellies"
                  />
                </Field>
              </>
            )}

            {partner2IsFemale && (
              <>
                <Q label="Are you giving special gifts to anyone that morning that you want us to capture?">
                  <YesNo value={plan.groom_gifts} onChange={v => set('groom_gifts', v)} />
                </Q>

                {plan.groom_gifts && (
                  <Field label="Tell us about the gifts" hint="Who are they for, and are there cards or emotional moments we should be ready for?">
                    <textarea
                      value={plan.groom_gifts_notes ?? ''}
                      onChange={e => set('groom_gifts_notes', e.target.value || null)}
                      rows={3}
                      className={textareaClass}
                      placeholder="e.g. Gifts for the bridesmaids and a letter for Mum"
                    />
                  </Field>
                )}

                <Field
                  label="Is there anywhere special at your prep location you would love photos?"
                  hint="A favourite room, a garden, somewhere with a memory attached."
                >
                  <textarea
                    value={plan.groom_prep_location_notes ?? ''}
                    onChange={e => set('groom_prep_location_notes', e.target.value || null)}
                    rows={2}
                    className={textareaClass}
                    placeholder="e.g. The window seat in Mum's room, the garden we grew up in"
                  />
                </Field>
              </>
            )}

          </div>
        </>
      )}

      {/* ── SECTION 04/03: Ceremony ── */}
      <SectionBanner
        number={twoPhotographers ? '04' : '03'}
        title="The Ceremony"
        subtitle="A few things that are easy to miss if we do not know about them in advance."
        imageUrl="/sections/04-ceremony.jpg"
      />
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-12 space-y-10">

        {(twoGrooms || twoBrides) && (
          <>
            <Q label="How are you entering the ceremony?">
              <Toggle3
                value={plan.aisle_entrance_style as 'together' | 'one_at_a_time' | 'other' | null}
                onChange={v => set('aisle_entrance_style', v)}
                options={[
                  { value: 'together' as const, label: 'Walking in together' },
                  { value: 'one_at_a_time' as const, label: 'One at a time with family' },
                  { value: 'other' as const, label: 'Something else' },
                ]}
              />
            </Q>

            {plan.aisle_entrance_style === 'one_at_a_time' && (
              <Field
                label="Tell us how it will work"
                hint="Who is walking with whom, and in what order? We want to be in the right position for both entrances."
              >
                <textarea
                  value={plan.aisle_entrance_notes ?? ''}
                  onChange={e => set('aisle_entrance_notes', e.target.value || null)}
                  rows={2}
                  className={textareaClass}
                  placeholder="e.g. James walks in first with his mum, then Tom walks in after with his dad"
                />
              </Field>
            )}

            {plan.aisle_entrance_style === 'other' && (
              <Field
                label="Tell us about your entrance"
                hint="Every wedding is different. The more you tell us, the better placed we are to capture it."
              >
                <textarea
                  value={plan.aisle_entrance_notes ?? ''}
                  onChange={e => set('aisle_entrance_notes', e.target.value || null)}
                  rows={3}
                  className={textareaClass}
                  placeholder="e.g. My son is walking me down the aisle"
                />
              </Field>
            )}
          </>
        )}

        <Field
          label="Is anything special happening during the ceremony we need to know about?"
          hint="Think unique touches like a handfasting, a quaich or loving cup, a sand ceremony, Kintsugi, jumping the broom, as well as any surprise songs, readings or performances from guests."
        >
          <textarea
            value={plan.ceremony_special_moments ?? ''}
            onChange={e => set('ceremony_special_moments', e.target.value || null)}
            rows={3}
            className={textareaClass}
            placeholder="e.g. We are doing a handfasting and my sister is singing after the vows as a surprise, or we have a sand ceremony that includes the children"
          />
        </Field>

        {(() => {
          const celebrant = people.find(p => p.role === 'supplier_celebrant')
          return celebrant ? (
            <div className="border border-hairline px-6 py-5 max-w-lg space-y-1">
              <p className="text-[10px] tracking-label uppercase text-mauve mb-3">Your celebrant</p>
              <p className="text-base font-light text-ink">{celebrant.name}</p>
              {celebrant.phone && <p className="text-sm text-whisper">{celebrant.phone}</p>}
              {celebrant.email && (
                <p className="text-sm text-whisper">
                  {celebrant.email}
                  <span className="block text-[11px] italic text-mauve-soft mt-1">
                    We will use this to introduce ourselves before your day.
                  </span>
                </p>
              )}
              {!celebrant.email && (
                <p className="text-[11px] italic text-whisper mt-2">
                  Add their email in{' '}
                  <a href="/home/people" className="text-mauve underline underline-offset-2">&ldquo;Our Circle&rdquo;</a>
                  {' '}and we will introduce ourselves before your day.
                </p>
              )}
            </div>
          ) : (
            <div className="border border-hairline border-dashed px-6 py-5 max-w-lg">
              <p className="text-sm text-ink font-light mb-1">Who is your celebrant, priest or minister?</p>
              <p className="text-[11px] text-whisper mb-3">
                Add them to Our Circle with their name, phone and email. We will know who we are walking in to meet, and if you give us their email we can introduce ourselves before the day.
              </p>
              <a
                href="/home/people"
                className="text-[11px] tracking-label uppercase text-mauve border border-mauve px-5 py-2 inline-block hover:bg-mauve hover:text-cream transition-colors"
              >
                Add to Our Circle
              </a>
            </div>
          )
        })()}

        <Field
          label="How is your celebrant with photography?"
          hint="Some celebrants work closely with us and some priests and ministers have very strict rules about where we can be and when. We never use flash inside a church to maintain the ambience, but if there is anything specific we need to know, tell us here."
        >
          <textarea
            value={plan.celebrant_notes ?? ''}
            onChange={e => set('celebrant_notes', e.target.value || null)}
            rows={2}
            className={textareaClass}
            placeholder="e.g. Fr George will not allow any photographs of the bride at the front of the church unless we arrive 10 minutes early"
          />
        </Field>

        <Q
          label="Would you like a bridal party shot at the altar or front of the room before you walk back down?"
          hint="This is fabulous in a church setting and gives you a beautiful official shot of the full bridal party together. It is essential for some couples and others would prefer to pass. Pick what feels right for you."
        >
          <YesNo value={plan.altar_shot} onChange={v => set('altar_shot', v)} />
        </Q>

        <Q
          label="Are you doing a dip at the ceremony exit?"
          hint="You will have seen it all over social media right now. It is a popular trend and it photographs beautifully. If it is something you fancy, just say yes and we will make sure we are in exactly the right position when it happens."
        >
          <YesNo value={plan.ceremony_dip} onChange={v => set('ceremony_dip', v)} />
        </Q>

        <Q label="Are you throwing confetti?">
          <YesNo value={plan.confetti} onChange={v => set('confetti', v)} />
        </Q>

        {plan.confetti && (
          <>
            <div className="border border-hairline bg-blush/30 px-6 py-5 max-w-lg">
              <p className="text-[11px] tracking-label uppercase text-mauve mb-2">Our tip</p>
              <p className="text-sm text-ink font-light leading-relaxed">
                The most stunning confetti photographs happen when you step back inside while the bridal party hand out the confetti to guests outside. We use that time to capture the empty room and the flowers, then when everyone is ready, you walk back out together through the throw. The difference in the photographs is extraordinary.
              </p>
            </div>
            <Field label="Tell us how you would like to do your confetti moment">
              <textarea
                value={plan.confetti_notes ?? ''}
                onChange={e => set('confetti_notes', e.target.value || null)}
                rows={3}
                className={textareaClass}
                placeholder="e.g. We love that idea of stepping back inside — we will definitely do that. We are having biodegradable petal confetti."
              />
            </Field>
          </>
        )}

        <Q label="What is your tradition with guests after the ceremony?">
          <div className="flex flex-col gap-3 max-w-sm">
            {([
              { value: 'meet_greet', label: 'Meet and greet everyone' },
              { value: 'mingle', label: 'Mingle naturally' },
              { value: 'straight_to_cars', label: 'Straight to the cars, start the party' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('post_ceremony_style', opt.value)}
                className={`py-3 px-4 text-sm border text-left transition-colors ${
                  plan.post_ceremony_style === opt.value
                    ? 'bg-plum border-plum text-cream'
                    : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Q>

        <Q label="Are you visiting anyone who cannot attend the wedding?">
          <YesNo value={plan.special_visit} onChange={v => set('special_visit', v)} />
        </Q>

        {plan.special_visit && (
          <>
            <Field label="Address for the visit" hint="Full address including postcode — we will need to map this.">
              <textarea
                value={plan.special_visit_address ?? ''}
                onChange={e => set('special_visit_address', e.target.value || null)}
                rows={2}
                className={textareaClass}
                placeholder="e.g. Lakeland Nursing Home, 22 Shore Road, Enniskillen, BT74 6NP"
              />
            </Field>
            <Field label="Who is at the visit and who is joining you?">
              <textarea
                value={plan.special_visit_notes ?? ''}
                onChange={e => set('special_visit_notes', e.target.value || null)}
                rows={2}
                className={textareaClass}
                placeholder="e.g. Granda Tom, and we would like bride's parents in the photograph too"
              />
            </Field>
          </>
        )}

        <Q label="Are there refreshments organised near the ceremony venue?">
          <YesNo value={plan.post_ceremony_refreshments} onChange={v => set('post_ceremony_refreshments', v)} />
        </Q>

        {plan.post_ceremony_refreshments && (
          <Field label="Tell us more" hint="Coffee cart, parish hall, sandwiches — anything that affects timing.">
            <input
              type="text"
              value={plan.post_ceremony_refreshments_notes ?? ''}
              onChange={e => set('post_ceremony_refreshments_notes', e.target.value || null)}
              className={inputClass}
              placeholder="e.g. Tea and sandwiches in the parish hall for about 30 minutes"
            />
          </Field>
        )}

      </div>

      {/* ── SECTION 05/04: Photo Shoot ── */}
      <SectionBanner
        number={twoPhotographers ? '05' : '04'}
        title="The Photo Shoot"
        subtitle="Where you go after the ceremony and who comes with you."
        imageUrl="/sections/05-photo-shoot.jpg"
      />
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-12 space-y-10">

        <Field
          label="Where are you going for photographs?"
          hint="Full address including postcode. We will map this and share it with everyone who needs to be there — photographers, videographer, drivers."
        >
          <textarea
            value={plan.photo_shoot_address ?? ''}
            onChange={e => set('photo_shoot_address', e.target.value || null)}
            rows={3}
            className={textareaClass}
            placeholder="e.g. Castle Coole, Enniskillen, BT74 6JY, or the reception venue itself"
          />
        </Field>

        <Q label="Who is joining you at the shoot?">
          <Toggle3
            value={plan.photo_shoot_attendees as 'couple' | 'couple_and_bridal' | 'everyone' | null}
            onChange={v => set('photo_shoot_attendees', v)}
            options={[
              { value: 'couple' as const, label: 'Just the two of us' },
              { value: 'couple_and_bridal' as const, label: 'Us and bridal party' },
              { value: 'everyone' as const, label: 'Us, bridal party and immediate family' },
            ]}
          />
        </Q>

        <Field
          label="Is there a spot at the location that you particularly love?"
          hint="A particular look, a location within the location, a shot you have seen and loved. Keep it loose — we will add our own ideas too."
        >
          <textarea
            value={plan.photo_shoot_notes ?? ''}
            onChange={e => set('photo_shoot_notes', e.target.value || null)}
            rows={3}
            className={textareaClass}
            placeholder="e.g. There is a walled garden at the back we would love, or a bridge we saw in the grounds"
          />
        </Field>

      </div>

      {/* ── SECTION 06/05: Reception ── */}
      <SectionBanner
        number={twoPhotographers ? '06' : '05'}
        title="The Reception"
        subtitle="From the moment you enter the room to the last dance."
        imageUrl="/sections/06-reception.jpg"
      />
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-12 space-y-10">

        <Q label="Room Entrance">
          <Toggle3
            value={plan.room_entrance_style as 'announced' | 'bridal_party_first' | 'parents_bridal_party_first' | null}
            onChange={v => set('room_entrance_style', v)}
            options={[
              { value: 'announced' as const, label: 'Couple announced' },
              { value: 'bridal_party_first' as const, label: 'Bridal party then us' },
              { value: 'parents_bridal_party_first' as const, label: 'Parents, bridal party then us' },
            ]}
          />
        </Q>

        <Q label="Are you having speeches?">
          <div className="flex flex-col gap-2 max-w-xs">
            {([
              { value: 'after_call_in' as const, label: 'Yes — straight after call in' },
              { value: 'after_starter' as const, label: 'Yes — after starter' },
              { value: 'after_dinner' as const, label: 'Yes — after dinner' },
              { value: 'no_speeches' as const, label: 'No speeches' },
            ] as { value: string; label: string }[]).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('speeches_timing', opt.value)}
                className={`py-3 px-4 text-sm border text-left transition-colors ${
                  plan.speeches_timing === opt.value
                    ? 'bg-plum border-plum text-cream'
                    : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Q>

        {plan.speeches_timing !== 'no_speeches' && (
        <>
        <Q
          label="Who is speaking, and in what order?"
          hint="Select each speaker in turn. A new slot appears automatically once each one is filled."
        >
          {people.length === 0 ? (
            <div className="border border-hairline border-dashed px-6 py-5 max-w-lg">
              <p className="text-sm text-ink font-light mb-1">Add your speakers to Our Circle first</p>
              <p className="text-[11px] text-whisper mb-3">
                Pop in each person who will be speaking — best man, father of the bride, the couple themselves — with their name and any contact details you have. Once they are in Our Circle, they will appear here to select and we can send them speech tips and timings at just the right moment.
              </p>
              <a
                href="/home/people"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] tracking-label uppercase text-mauve border border-mauve px-5 py-2 inline-block hover:bg-mauve hover:text-cream transition-colors"
              >
                Go to Our Circle
              </a>
            </div>
          ) : (
            <div className="space-y-4 max-w-sm">
              {([...speakerIds, '']).map((speakerId, idx) => {
                const isEmptySlot = idx === speakerIds.length
                const ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth']
                const ordinal = ordinals[idx] ?? `Speaker ${idx + 1}`
                const unavailable = speakerIds.filter((_, j) => j !== idx)
                const options = allSpeakerOptions.filter(p => !unavailable.includes(p.id))

                return (
                  <div key={idx} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="text-[10px] tracking-label uppercase text-whisper/60 block mb-1">
                        {ordinal} speaker
                      </label>
                      <select
                        value={speakerId}
                        onChange={e => {
                          const next = [...speakerIds]
                          if (isEmptySlot) next.push(e.target.value)
                          else next[idx] = e.target.value
                          set('speeches_speakers', JSON.stringify(next))
                        }}
                        className={inputClass}
                      >
                        {isEmptySlot && <option value="" disabled>Select from Our Circle</option>}
                        {options.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    {!isEmptySlot && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = speakerIds.filter((_, j) => j !== idx)
                          set('speeches_speakers', next.length ? JSON.stringify(next) : null)
                        }}
                        className="pb-3 text-lg text-whisper hover:text-ink flex-shrink-0"
                        aria-label="Remove speaker"
                      >
                        ×
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Q>

        <Field
          label="Anything else we should know about the speeches?"
          hint="For example, where non-top-table speakers will be seated, or anything that will help us be in the right place."
        >
          <textarea
            value={plan.speeches_notes ?? ''}
            onChange={e => set('speeches_notes', e.target.value || null)}
            rows={3}
            className={textareaClass}
            placeholder="e.g. Best man Sean will be at table 3, not the top table"
          />
        </Field>
        </>
        )}

        <Q label="Is there any meal entertainment?">
          <YesNo value={plan.meal_entertainment} onChange={v => set('meal_entertainment', v)} />
        </Q>

        {plan.meal_entertainment && (
          <Field label="Tell us about it" hint="What is happening and at what point during the meal?">
            <textarea
              value={plan.meal_entertainment_notes ?? ''}
              onChange={e => set('meal_entertainment_notes', e.target.value || null)}
              rows={2}
              className={textareaClass}
              placeholder="e.g. DJ games after main course — hoola hoops and singing competition"
            />
          </Field>
        )}

        <Q label="First dance — are you inviting the bridal party to join you on the dance floor?">
          <Toggle3
            value={plan.first_dance_style as 'alone' | 'invite_bridal_party' | null}
            onChange={v => set('first_dance_style', v)}
            options={[
              { value: 'alone' as const, label: 'We are dancing to the full song' },
              { value: 'invite_bridal_party' as const, label: 'Bridal party joining us half way through' },
            ]}
          />
        </Q>

        <Q label="Is your first dance choreographed?">
          <YesNo value={plan.first_dance_choreographed} onChange={v => set('first_dance_choreographed', v)} />
        </Q>

        {plan.first_dance_choreographed && (
          <Field
            label="Tell us about the choreography"
            hint="Any key moves or positions we should know about — especially dips, lifts, or turns where camera position matters."
          >
            <textarea
              value={plan.first_dance_notes ?? ''}
              onChange={e => set('first_dance_notes', e.target.value || null)}
              rows={3}
              className={textareaClass}
              placeholder="e.g. There is a dip at the end of the second chorus, facing the guests"
            />
          </Field>
        )}

        {!twoGrooms && (
          <>
            <Q label="Are you wearing a second dress?">
              <YesNo value={plan.second_dress} onChange={v => set('second_dress', v)} />
            </Q>

            {plan.second_dress && (
              <Q label="Will you be changing before the 4th song?">
                <div className="flex flex-col gap-2 max-w-xs">
                  {([
                    { value: 'before_fourth', label: 'Yes, before the 4th song' },
                    { value: 'after_fourth', label: 'No, after that' },
                  ] as { value: string; label: string }[]).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('second_dress_notes', opt.value)}
                      className={`py-3 px-4 text-sm border text-left transition-colors ${
                        plan.second_dress_notes === opt.value
                          ? 'bg-plum border-plum text-cream'
                          : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Q>
            )}

            {plan.second_dress && plan.second_dress_notes === 'before_fourth' && (
              <div className="border border-hairline px-6 py-5 bg-blush-soft max-w-lg">
                <p className="text-sm text-ink font-light">
                  Happy days — we will make sure we get a few beautiful images of you in your second dress.
                </p>
              </div>
            )}

            {plan.second_dress && plan.second_dress_notes === 'after_fourth' && (
              <div className="border border-hairline px-6 py-5 bg-blush-soft max-w-lg">
                <p className="text-sm text-ink font-light">
                  On your current coverage we won't be there to capture that dress. If you'd like us to stay for it, have a chat with us about your package.
                </p>
              </div>
            )}
          </>
        )}

        <Q label={twoGrooms || twoBrides ? "Are either of you doing a special dance with a parent?" : "Is there a father-daughter dance?"}>
          <YesNo value={plan.daddy_daughter_dance} onChange={v => set('daddy_daughter_dance', v)} />
        </Q>

        <Q
          label="Would you like evening outdoor shots after dinner?"
          hint="If you are at a beautiful venue with great grounds, the evening light can be magical."
        >
          <YesNo value={plan.evening_outdoor_shots} onChange={v => set('evening_outdoor_shots', v)} />
        </Q>

        {plan.evening_outdoor_shots && (
          <Field label="Where are you thinking?">
            <input
              type="text"
              value={plan.evening_outdoor_notes ?? ''}
              onChange={e => set('evening_outdoor_notes', e.target.value || null)}
              className={inputClass}
              placeholder="e.g. The terrace overlooking the lake, or the walled garden"
            />
          </Field>
        )}

        <Q label="Are there sparklers or fireworks in the evening?">
          <YesNo value={plan.sparklers_fireworks} onChange={v => set('sparklers_fireworks', v)} />
        </Q>

        {plan.sparklers_fireworks && (
          <Q label="Sparklers or fireworks?">
            <div className="flex flex-col gap-2 max-w-xs">
              {([
                { value: 'sparklers', label: 'Sparklers' },
                { value: 'fireworks', label: 'Fireworks' },
              ] as { value: string; label: string }[]).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('sparklers_fireworks_type', opt.value)}
                  className={`py-3 px-4 text-sm border text-left transition-colors ${
                    plan.sparklers_fireworks_type === opt.value
                      ? 'bg-plum border-plum text-cream'
                      : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Q>
        )}

        {plan.sparklers_fireworks && plan.sparklers_fireworks_type === 'sparklers' && (
          <>
            <div className="border border-hairline px-6 py-5 bg-blush-soft max-w-lg">
              <p className="text-sm text-ink font-light">
                Make sure your sparklers are long ones and that you have plenty of lighters. Short sparklers burn out before everyone is lit and the moment is lost. We will help organise everyone but the more lighters the better.
              </p>
            </div>
            <Q label="What are you thinking for the sparklers?">
              <div className="flex flex-col gap-2 max-w-xs">
                {([
                  { value: 'few_friends', label: 'A few close friends' },
                  { value: 'everyone', label: 'Everyone out together' },
                ] as { value: string; label: string }[]).map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('sparklers_who', opt.value)}
                    className={`py-3 px-4 text-sm border text-left transition-colors ${
                      plan.sparklers_who === opt.value
                        ? 'bg-plum border-plum text-cream'
                        : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Q>
          </>
        )}

        {plan.sparklers_fireworks && plan.sparklers_fireworks_type === 'fireworks' && (
          <div className="border border-hairline px-6 py-5 bg-blush-soft max-w-lg">
            <p className="text-sm text-ink font-light">
              On your current package we won't be there to capture the fireworks. If you'd like us to stay for them, have a chat with us about your coverage.
            </p>
          </div>
        )}

      </div>

      {/* Save */}
      <div className="max-w-4xl mx-auto px-8 md:px-16 pt-4 pb-16">
        <div className="border-t border-hairline pt-12">
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="py-4 px-12 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors disabled:opacity-40"
            >
              {saving ? 'Saving...' : 'Save your plan'}
            </button>
            {saved && (
              <span className="text-sm text-whisper italic">Saved.</span>
            )}
          </div>
          <p className="text-xs text-whisper/60 mt-4 italic">
            You can come back and update this any time. We will use everything here to make sure your day runs beautifully.
          </p>
        </div>
      </div>

    </main>
  )
}

import Link from 'next/link'
import { ROLES } from '@/content/roles'

export type BriefPerson = {
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
  in_family_photos: boolean
}

export type BriefShot = {
  id: string
  label: string
  people: string | null
  notes: string | null
}

export type BriefDayPlan = {
  photographer_count: number | null
  guest_count: number | null
  bride_prep_address: string | null
  bride_has_children: boolean
  bride_children_ages: string | null
  bride_children_needs: string | null
  bride_dad_reveal: boolean
  bride_bridesmaids_reveal: boolean
  bride_gifts: boolean
  bride_gifts_notes: string | null
  bride_prep_location_notes: string | null
  bride_pub_stop: boolean
  bride_personality_notes: string | null
  groom_prep_address: string | null
  groom_has_children: boolean
  groom_children_ages: string | null
  groom_children_needs: string | null
  groom_personality_notes: string | null
  groom_pub_stop: boolean
  groom_dad_reveal: boolean
  groom_bridesmaids_reveal: boolean
  groom_gifts: boolean
  groom_gifts_notes: string | null
  groom_prep_location_notes: string | null
  getting_ready_together: boolean
  aisle_entrance_style: string | null
  aisle_entrance_notes: string | null
  ceremony_special_moments: string | null
  celebrant_notes: string | null
  altar_shot: boolean
  post_ceremony_style: string | null
  ceremony_dip: boolean
  confetti: boolean
  confetti_notes: string | null
  special_visit: boolean
  special_visit_address: string | null
  special_visit_notes: string | null
  post_ceremony_refreshments: boolean
  post_ceremony_refreshments_notes: string | null
  photo_shoot_address: string | null
  photo_shoot_attendees: string | null
  photo_shoot_notes: string | null
  room_entrance_style: string | null
  room_entrance_notes: string | null
  speeches_timing: string | null
  speeches_speakers: string | null
  speeches_notes: string | null
  meal_entertainment: boolean
  meal_entertainment_notes: string | null
  first_dance_style: string | null
  first_dance_choreographed: boolean
  first_dance_notes: string | null
  first_songs: string | null
  daddy_daughter_dance: boolean
  second_dress: boolean
  second_dress_notes: string | null
  leaving_outfit_change: boolean
  leaving_outfit_change_notes: string | null
  evening_outdoor_shots: boolean
  evening_outdoor_notes: string | null
  sparklers_fireworks: boolean
  sparklers_fireworks_type: string | null
  sparklers_who: string | null
}

export type BriefCouple = {
  bride_name: string
  groom_name: string
  partner_1_gender: string | null
  partner_2_gender: string | null
  wedding_date: string | null
  venue_name: string | null
  venue_address: string | null
  ceremony_name: string | null
  ceremony_address: string | null
}

type Props = {
  couple: BriefCouple
  people: BriefPerson[]
  shots: BriefShot[]
  plan: BriefDayPlan | null
  backHref: string
  backLabel: string
}

const BRIDE_PARTY_ROLES = ['maid_of_honour', 'bridesmaid', 'flower_girl_guardian']
const GROOM_PARTY_ROLES = ['best_man', 'groomsman', 'usher', 'page_boy_guardian']

function mapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

function roleLabel(slug: string | null, notes?: string | null) {
  if (!slug) return ''
  if (slug === 'supplier_other' && notes) return notes
  return ROLES.find(r => r.slug === slug)?.label ?? slug
}

function BriefSection({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline pt-8 pb-2">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-[10px] tracking-label uppercase text-mauve-soft w-6 flex-shrink-0">{n}</span>
        <h2 className="text-[11px] tracking-label uppercase text-mauve">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Row({ label, value, link }: { label: string; value: string | null | undefined; link?: string }) {
  if (!value) return null
  return (
    <div className="flex gap-4 py-2 border-b border-hairline/50 last:border-0">
      <span className="text-[10px] tracking-label uppercase text-whisper w-32 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-ink flex-1">
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-mauve underline underline-offset-2">
            {value} ↗
          </a>
        ) : value}
      </span>
    </div>
  )
}

function Flag({ label, yes }: { label: string; yes: boolean }) {
  if (!yes) return null
  return (
    <div className="flex gap-4 py-2 border-b border-hairline/50 last:border-0">
      <span className="text-[10px] tracking-label uppercase text-whisper w-32 flex-shrink-0 pt-0.5">{label}</span>
      <span className="inline-block text-[10px] tracking-label uppercase px-2 py-0.5 border border-plum text-plum">Yes</span>
    </div>
  )
}

function postCeremonyLabel(s: string | null) {
  if (s === 'meet_greet') return 'Meet and greet every guest'
  if (s === 'mingle') return 'Mingle naturally'
  if (s === 'straight_to_cars') return 'Straight to the cars'
  return null
}

function shootAttendeesLabel(v: string | null) {
  if (v === 'couple') return 'Just the couple'
  if (v === 'couple_and_bridal') return 'Couple and bridal party'
  if (v === 'everyone') return 'Everyone, including families'
  return null
}

function roomEntranceLabel(v: string | null) {
  if (v === 'announced') return 'Couple announced together'
  if (v === 'bridal_party_first') return 'Bridal party first, then couple'
  if (v === 'parents_bridal_party_first') return 'Parents and bridal party first, then couple'
  return null
}

function aisleEntranceLabel(v: string | null) {
  if (v === 'together') return 'Walking in together'
  if (v === 'one_first') return 'One partner entering first, then the other'
  return null
}

function speechesTimingLabel(v: string | null) {
  if (v === 'after_call_in') return 'Straight after call in'
  if (v === 'after_starter') return 'After starter'
  if (v === 'after_dinner') return 'After dinner'
  return null
}

function firstDanceLabel(v: string | null) {
  if (v === 'alone') return 'Dancing to the full song (couple only)'
  if (v === 'invite_bridal_party') return 'Bridal party joining half way through'
  return null
}

function sparklerWhoLabel(v: string | null) {
  if (v === 'few_friends') return 'A few close friends'
  if (v === 'everyone') return 'Everyone out together'
  return null
}

const LABEL_BY_REL = new Set(['Mum', 'Dad', 'Step-mum', 'Step-dad'])

function personLabel(p: BriefPerson, brideName: string, groomName: string): string {
  if (p.name === brideName) return brideName.split(' ')[0]
  if (p.name === groomName) return groomName.split(' ')[0]
  if (p.family_relationship && LABEL_BY_REL.has(p.family_relationship)) return p.family_relationship
  return p.name.split(' ')[0]
}

function formatGroup(arr: BriefPerson[], brideName: string, groomName: string): string {
  const labels = arr.map(p => personLabel(p, brideName, groomName))
  const count: Record<string, number> = {}
  labels.forEach(l => { count[l] = (count[l] ?? 0) + 1 })
  return arr.map((p, i) => count[labels[i]] > 1 ? p.name : labels[i]).join(', ')
}

function formatPeopleStr(str: string | null, allPeople: BriefPerson[], brideName: string, groomName: string): string {
  if (!str) return ''
  const parts = str.split(', ')
  const labels = parts.map(name => {
    if (name === brideName) return brideName.split(' ')[0]
    if (name === groomName) return groomName.split(' ')[0]
    const p = allPeople.find(x => x.name === name)
    if (p?.family_relationship && LABEL_BY_REL.has(p.family_relationship)) return p.family_relationship
    return name.split(' ')[0]
  })
  const count: Record<string, number> = {}
  labels.forEach(l => { count[l] = (count[l] ?? 0) + 1 })
  return parts.map((n, i) => count[labels[i]] > 1 ? n : labels[i]).join(', ')
}

function generateFamilyGroups(people: BriefPerson[], brideName: string, groomName: string): string[] {
  const family = people.filter(p => {
    const rg = ROLES.find(r => r.slug === p.role)?.group
    return p.is_family && rg !== 'bridal_party'
  })

  const bSide = family.filter(p => p.side === 'partner_1')
  const gSide = family.filter(p => p.side === 'partner_2')
  const fmt = (arr: BriefPerson[]) => formatGroup(arr, brideName, groomName)

  const bParents = bSide.filter(p => ['Mum','Dad','Step-mum','Step-dad'].includes(p.family_relationship ?? ''))
  const gParents = gSide.filter(p => ['Mum','Dad','Step-mum','Step-dad'].includes(p.family_relationship ?? ''))
  const bSiblings = bSide.filter(p => ['Sister','Brother','Step-sister','Step-brother'].includes(p.family_relationship ?? ''))
  const gSiblings = gSide.filter(p => ['Sister','Brother','Step-sister','Step-brother'].includes(p.family_relationship ?? ''))
  const bSibPartners = bSide.filter(p => ['Partner','Sister-in-law','Brother-in-law'].includes(p.family_relationship ?? '') && p.in_family_photos)
  const gSibPartners = gSide.filter(p => ['Partner','Sister-in-law','Brother-in-law'].includes(p.family_relationship ?? '') && p.in_family_photos)
  const bGrandparents = bSide.filter(p => ['Grandmother','Grandfather','Step-grandmother','Step-grandfather'].includes(p.family_relationship ?? ''))
  const gGrandparents = gSide.filter(p => ['Grandmother','Grandfather','Step-grandmother','Step-grandfather'].includes(p.family_relationship ?? ''))

  const shots: string[] = []

  if (bParents.length > 0) shots.push(`Couple with ${brideName}'s parents — ${fmt(bParents)}`)
  if (bParents.length > 0 && gParents.length > 0) shots.push(`Couple with both sets of parents — ${fmt([...bParents, ...gParents])}`)
  if (gParents.length > 0) shots.push(`Couple with ${groomName}'s parents — ${fmt(gParents)}`)

  const bImmediateAll = [...bParents, ...bSiblings, ...bSibPartners]
  if (bImmediateAll.length > 0) shots.push(`${brideName}'s immediate family — ${fmt(bImmediateAll)}`)
  if (bParents.length > 0 && bSiblings.length > 0) shots.push(`${brideName} with parents and siblings — ${fmt([...bParents, ...bSiblings])}`)
  if (bParents.length >= 2) shots.push(`${brideName}'s parents together — ${fmt(bParents)}`)
  if (bSiblings.length > 0) shots.push(`${brideName} with siblings — ${fmt(bSiblings)}`)

  const gImmediateAll = [...gParents, ...gSiblings, ...gSibPartners]
  if (gImmediateAll.length > 0) shots.push(`${groomName}'s immediate family — ${fmt(gImmediateAll)}`)
  if (gParents.length > 0 && gSiblings.length > 0) shots.push(`${groomName} with parents and siblings — ${fmt([...gParents, ...gSiblings])}`)
  if (gParents.length >= 2) shots.push(`${groomName}'s parents together — ${fmt(gParents)}`)
  if (gSiblings.length > 0) shots.push(`${groomName} with siblings — ${fmt(gSiblings)}`)

  bGrandparents.forEach(gp => shots.push(`Couple with ${personLabel(gp, brideName, groomName)} (${brideName}'s side)`))
  gGrandparents.forEach(gp => shots.push(`Couple with ${personLabel(gp, brideName, groomName)} (${groomName}'s side)`))

  return shots
}

export default function BriefView({ couple, people, shots, plan, backHref, backLabel }: Props) {
  const { bride_name: brideName, groom_name: groomName } = couple

  const partner1IsMale = couple.partner_1_gender === 'man'
  const partner2IsFemale = couple.partner_2_gender === 'woman'
  const twoGrooms = couple.partner_1_gender === 'man' && couple.partner_2_gender === 'man'
  const twoBrides = couple.partner_1_gender === 'woman' && couple.partner_2_gender === 'woman'
  const sameSeхCouple = twoGrooms || twoBrides

  const weddingDate = couple.wedding_date
    ? new Date(couple.wedding_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const daysUntil = couple.wedding_date
    ? Math.ceil((new Date(couple.wedding_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const brideParty = people.filter(p => BRIDE_PARTY_ROLES.includes(p.role ?? ''))
  const groomParty = people.filter(p => GROOM_PARTY_ROLES.includes(p.role ?? ''))
  const brideFamily = people.filter(p => {
    const rg = ROLES.find(r => r.slug === p.role)?.group
    return (p.is_family || rg === 'family') && rg !== 'bridal_party' && p.side === 'partner_1'
  })
  const groomFamily = people.filter(p => {
    const rg = ROLES.find(r => r.slug === p.role)?.group
    return (p.is_family || rg === 'family') && rg !== 'bridal_party' && p.side === 'partner_2'
  })
  const suppliers = people.filter(p => ROLES.find(r => r.slug === p.role)?.group === 'supplier')
  const familyGroups = generateFamilyGroups(people, brideName, groomName)
  const twoPhotographers = plan?.photographer_count === 2

  return (
    <main className="min-h-screen bg-cream">
      <div className="bg-plum text-cream px-6 md:px-12 pt-10 pb-10">
        <div className="max-w-2xl mx-auto">
          <Link href={backHref} className="text-[10px] tracking-label uppercase text-mauve-soft hover:text-cream transition-colors mb-5 block">
            ← {backLabel}
          </Link>
          <div className="text-[10px] tracking-label uppercase text-mauve-soft mb-2">Photographer&apos;s Brief</div>
          <h1 className="text-3xl font-light text-cream leading-tight">{brideName} &amp; {groomName}</h1>
          {weddingDate && <p className="text-cream/70 text-sm mt-2">{weddingDate}</p>}
          {daysUntil !== null && daysUntil > 0 && (
            <p className="text-mauve-soft text-[11px] tracking-label uppercase mt-3">{daysUntil} days to go</p>
          )}
          {daysUntil !== null && daysUntil <= 0 && (
            <p className="text-mauve-soft text-[11px] tracking-label uppercase mt-3">Wedding day</p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-12 py-10 space-y-0">

        <BriefSection n="★" title="Locations">
          <div className="space-y-4">
            {plan?.bride_prep_address && (
              <div className="flex gap-4 items-start">
                <span className="text-[10px] tracking-label uppercase text-whisper w-28 flex-shrink-0 pt-1">Bridal prep</span>
                <a href={mapsLink(plan.bride_prep_address)} target="_blank" rel="noopener noreferrer" className="text-sm text-mauve underline underline-offset-2">{plan.bride_prep_address} ↗</a>
              </div>
            )}
            {twoPhotographers && plan?.groom_prep_address && (
              <div className="flex gap-4 items-start">
                <span className="text-[10px] tracking-label uppercase text-whisper w-28 flex-shrink-0 pt-1">Groom prep</span>
                <a href={mapsLink(plan.groom_prep_address)} target="_blank" rel="noopener noreferrer" className="text-sm text-mauve underline underline-offset-2">{plan.groom_prep_address} ↗</a>
              </div>
            )}
            {couple.ceremony_address && (
              <div className="flex gap-4 items-start">
                <span className="text-[10px] tracking-label uppercase text-whisper w-28 flex-shrink-0 pt-1">Ceremony</span>
                <div>
                  {couple.ceremony_name && <span className="text-xs text-whisper block mb-0.5">{couple.ceremony_name}</span>}
                  <a href={mapsLink(couple.ceremony_address)} target="_blank" rel="noopener noreferrer" className="text-sm text-mauve underline underline-offset-2">{couple.ceremony_address} ↗</a>
                </div>
              </div>
            )}
            {plan?.photo_shoot_address && (
              <div className="flex gap-4 items-start">
                <span className="text-[10px] tracking-label uppercase text-whisper w-28 flex-shrink-0 pt-1">Photo shoot</span>
                <a href={mapsLink(plan.photo_shoot_address)} target="_blank" rel="noopener noreferrer" className="text-sm text-mauve underline underline-offset-2">{plan.photo_shoot_address} ↗</a>
              </div>
            )}
            {couple.venue_address && (
              <div className="flex gap-4 items-start">
                <span className="text-[10px] tracking-label uppercase text-whisper w-28 flex-shrink-0 pt-1">Reception</span>
                <div>
                  {couple.venue_name && <span className="text-xs text-whisper block mb-0.5">{couple.venue_name}</span>}
                  <a href={mapsLink(couple.venue_address)} target="_blank" rel="noopener noreferrer" className="text-sm text-mauve underline underline-offset-2">{couple.venue_address} ↗</a>
                </div>
              </div>
            )}
            {plan?.special_visit && plan?.special_visit_address && (
              <div className="flex gap-4 items-start">
                <span className="text-[10px] tracking-label uppercase text-whisper w-28 flex-shrink-0 pt-1">Special visit</span>
                <a href={mapsLink(plan.special_visit_address)} target="_blank" rel="noopener noreferrer" className="text-sm text-mauve underline underline-offset-2">{plan.special_visit_address} ↗</a>
              </div>
            )}
          </div>
        </BriefSection>

        {plan && (
          <BriefSection n="01" title="Package">
            <Row label="Photographers" value={plan.photographer_count ? `${plan.photographer_count}` : null} />
            <Row label="Guest count" value={plan.guest_count ? `${plan.guest_count} guests` : null} />
          </BriefSection>
        )}

        <BriefSection n="02" title={`${brideName}'s Morning`}>
          {plan?.bride_prep_address && <Row label="Getting ready" value={plan.bride_prep_address} link={mapsLink(plan.bride_prep_address)} />}
          {sameSeхCouple && <Flag label="Getting ready together" yes={plan?.getting_ready_together ?? false} />}
          <Flag label="Children joining" yes={plan?.bride_has_children ?? false} />
          {plan?.bride_has_children && plan?.bride_children_ages && (
            <Row label="Ages" value={plan.bride_children_ages} />
          )}
          {plan?.bride_has_children && plan?.bride_children_needs && (
            <Row label="Special needs" value={plan.bride_children_needs} />
          )}
          {!partner1IsMale && <Flag label="Dad reveal" yes={plan?.bride_dad_reveal ?? false} />}
          {!partner1IsMale && <Flag label="Bridesmaids reveal" yes={plan?.bride_bridesmaids_reveal ?? false} />}
          <Flag label="Pub stop" yes={plan?.bride_pub_stop ?? false} />
          <Flag label="Gift giving" yes={plan?.bride_gifts ?? false} />
          {plan?.bride_gifts_notes && <Row label="Gift notes" value={plan.bride_gifts_notes} />}
          {plan?.bride_prep_location_notes && <Row label="Location notes" value={plan.bride_prep_location_notes} />}
          {plan?.bride_personality_notes && <Row label="Personality notes" value={plan.bride_personality_notes} />}
          {brideParty.length > 0 && (
            <div className="mt-6">
              <p className="text-[10px] tracking-label uppercase text-whisper mb-3">{brideName}&apos;s party</p>
              <div className="space-y-0">
                {brideParty.map(p => (
                  <div key={p.id} className="flex items-start gap-3 py-2 border-b border-hairline/40 last:border-0">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-ink">{p.name}</span>
                      {p.role && <span className="text-[10px] tracking-label uppercase text-mauve ml-2">{roleLabel(p.role)}</span>}
                      {p.child_name && <span className="text-[10px] text-whisper ml-2 italic">{p.role === 'flower_girl_guardian' ? 'Flower girl' : 'Page boy'}: {p.child_name}</span>}
                    </div>
                    {p.phone && <a href={`tel:${p.phone}`} className="text-sm text-mauve flex-shrink-0">{p.phone}</a>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </BriefSection>

        {twoPhotographers && !(plan?.getting_ready_together) && (
          <BriefSection n="03" title={`${groomName}'s Morning`}>
            {plan?.groom_prep_address && <Row label="Getting ready" value={plan.groom_prep_address} link={mapsLink(plan.groom_prep_address)} />}
            <Flag label="Children joining" yes={plan?.groom_has_children ?? false} />
            {plan?.groom_has_children && plan?.groom_children_ages && (
              <Row label="Ages" value={plan.groom_children_ages} />
            )}
            {plan?.groom_has_children && plan?.groom_children_needs && (
              <Row label="Special needs" value={plan.groom_children_needs} />
            )}
            <Flag label="Pub stop" yes={plan?.groom_pub_stop ?? false} />
            {!partner2IsFemale && <Flag label="Dad reveal" yes={plan?.groom_dad_reveal ?? false} />}
            {!partner2IsFemale && <Flag label="Bridesmaids reveal" yes={plan?.groom_bridesmaids_reveal ?? false} />}
            <Flag label="Gift giving" yes={plan?.groom_gifts ?? false} />
            {plan?.groom_gifts_notes && <Row label="Gift notes" value={plan.groom_gifts_notes} />}
            {plan?.groom_prep_location_notes && <Row label="Location notes" value={plan.groom_prep_location_notes} />}
            {plan?.groom_personality_notes && <Row label="Personality notes" value={plan.groom_personality_notes} />}
            {groomParty.length > 0 && (
              <div className="mt-6">
                <p className="text-[10px] tracking-label uppercase text-whisper mb-3">{groomName}&apos;s party</p>
                <div className="space-y-0">
                  {groomParty.map(p => (
                    <div key={p.id} className="flex items-start gap-3 py-2 border-b border-hairline/40 last:border-0">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-ink">{p.name}</span>
                        {p.role && <span className="text-[10px] tracking-label uppercase text-mauve ml-2">{roleLabel(p.role)}</span>}
                        {p.child_name && <span className="text-[10px] text-whisper ml-2 italic">{p.role === 'flower_girl_guardian' ? 'Flower girl' : 'Page boy'}: {p.child_name}</span>}
                      </div>
                      {p.phone && <a href={`tel:${p.phone}`} className="text-sm text-mauve flex-shrink-0">{p.phone}</a>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </BriefSection>
        )}

        <BriefSection n={twoPhotographers ? '04' : '03'} title="The Ceremony">
          {couple.ceremony_address && (
            <Row label="Location" value={`${couple.ceremony_name ? couple.ceremony_name + ', ' : ''}${couple.ceremony_address}`} link={mapsLink(couple.ceremony_address)} />
          )}
          {sameSeхCouple && plan?.aisle_entrance_style && (
            <Row label="Aisle entrance" value={aisleEntranceLabel(plan.aisle_entrance_style) ?? plan.aisle_entrance_style} />
          )}
          {sameSeхCouple && plan?.aisle_entrance_notes && <Row label="Entrance notes" value={plan.aisle_entrance_notes} />}
          <Flag label="Altar shot" yes={plan?.altar_shot ?? false} />
          <Flag label="Dip at exit" yes={plan?.ceremony_dip ?? false} />
          <Flag label="Confetti" yes={plan?.confetti ?? false} />
          {plan?.confetti_notes && <Row label="Confetti notes" value={plan.confetti_notes} />}
          {plan?.post_ceremony_style && <Row label="After ceremony" value={postCeremonyLabel(plan.post_ceremony_style)} />}
          {plan?.ceremony_special_moments && <Row label="Special moments" value={plan.ceremony_special_moments} />}
          {plan?.celebrant_notes && <Row label="Celebrant" value={plan.celebrant_notes} />}
          {plan?.post_ceremony_refreshments && plan?.post_ceremony_refreshments_notes && (
            <Row label="Refreshments" value={plan.post_ceremony_refreshments_notes} />
          )}
          {plan?.special_visit && plan?.special_visit_address && (
            <Row label="Special visit" value={plan.special_visit_address} link={mapsLink(plan.special_visit_address)} />
          )}
          {plan?.special_visit && plan?.special_visit_notes && (
            <Row label="Visit notes" value={plan.special_visit_notes} />
          )}
        </BriefSection>

        <BriefSection n={twoPhotographers ? '05' : '04'} title="The Photo Shoot">
          {plan?.photo_shoot_address && <Row label="Location" value={plan.photo_shoot_address} link={mapsLink(plan.photo_shoot_address)} />}
          {plan?.photo_shoot_attendees && <Row label="Who attends" value={shootAttendeesLabel(plan.photo_shoot_attendees)} />}
          {plan?.photo_shoot_notes && <Row label="Notes" value={plan.photo_shoot_notes} />}
        </BriefSection>

        <BriefSection n={twoPhotographers ? '06' : '05'} title="Family Groups">
          {familyGroups.length === 0 ? (
            <p className="text-sm text-whisper italic">Add family members to <a href="/home/people" className="font-semibold text-plum hover:text-mauve transition-colors">Our Circle</a> to generate the group list.</p>
          ) : (
            <div className="space-y-0">
              {familyGroups.map((shot, i) => (
                <div key={i} className="flex gap-3 py-2.5 border-b border-hairline/40 last:border-0">
                  <span className="text-[10px] tracking-label uppercase text-mauve-soft w-6 flex-shrink-0 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-ink">{shot}</span>
                </div>
              ))}
            </div>
          )}
          {(brideFamily.length > 0 || groomFamily.length > 0) && (
            <div className="mt-8 space-y-6">
              {brideFamily.length > 0 && (
                <div>
                  <p className="text-[10px] tracking-label uppercase text-whisper mb-3">{brideName}&apos;s family contacts</p>
                  <div className="space-y-0">
                    {brideFamily.map(p => (
                      <div key={p.id} className="flex items-center gap-3 py-2 border-b border-hairline/40 last:border-0">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-ink">{p.name}</span>
                          {p.family_relationship && <span className="text-[10px] tracking-label uppercase text-whisper ml-2">{p.family_relationship}</span>}
                          {p.family_relationship === 'Partner' && (
                            <span className="text-[10px] text-mauve-soft ml-2 italic">{p.in_family_photos ? 'In photos' : 'Not in photos'}</span>
                          )}
                        </div>
                        {p.phone && <a href={`tel:${p.phone}`} className="text-sm text-mauve flex-shrink-0">{p.phone}</a>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {groomFamily.length > 0 && (
                <div>
                  <p className="text-[10px] tracking-label uppercase text-whisper mb-3">{groomName}&apos;s family contacts</p>
                  <div className="space-y-0">
                    {groomFamily.map(p => (
                      <div key={p.id} className="flex items-center gap-3 py-2 border-b border-hairline/40 last:border-0">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-ink">{p.name}</span>
                          {p.family_relationship && <span className="text-[10px] tracking-label uppercase text-whisper ml-2">{p.family_relationship}</span>}
                          {p.family_relationship === 'Partner' && (
                            <span className="text-[10px] text-mauve-soft ml-2 italic">{p.in_family_photos ? 'In photos' : 'Not in photos'}</span>
                          )}
                        </div>
                        {p.phone && <a href={`tel:${p.phone}`} className="text-sm text-mauve flex-shrink-0">{p.phone}</a>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </BriefSection>

        {shots.length > 0 && (
          <BriefSection n={twoPhotographers ? '07' : '06'} title="Shot Requests">
            <div className="space-y-0">
              {shots.map((shot, i) => (
                <div key={shot.id} className="flex gap-3 py-3 border-b border-hairline/40 last:border-0">
                  <span className="text-[10px] tracking-label uppercase text-mauve-soft w-6 flex-shrink-0 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <span className="text-sm text-ink block">{shot.label}</span>
                    {shot.people && <span className="text-sm text-whisper block mt-0.5">{formatPeopleStr(shot.people, people, brideName, groomName)}</span>}
                    {shot.notes && <span className="text-xs text-whisper/70 italic block mt-0.5">{shot.notes}</span>}
                  </div>
                </div>
              ))}
            </div>
          </BriefSection>
        )}

        <BriefSection n={twoPhotographers ? '08' : '07'} title="The Reception">
          {couple.venue_address && (
            <Row label="Venue" value={`${couple.venue_name ? couple.venue_name + ', ' : ''}${couple.venue_address}`} link={mapsLink(couple.venue_address)} />
          )}
          {plan?.room_entrance_style && <Row label="Room entrance" value={roomEntranceLabel(plan.room_entrance_style) ?? plan.room_entrance_notes} />}
          {plan?.room_entrance_notes && <Row label="Entrance notes" value={plan.room_entrance_notes} />}
          {plan?.speeches_timing && <Row label="Speeches" value={speechesTimingLabel(plan.speeches_timing)} />}
          {plan?.speeches_speakers && (() => {
            let ids: string[] = []
            try { ids = JSON.parse(plan.speeches_speakers) } catch { ids = [] }
            const names = ids.map(id => {
              if (id === 'partner_1') return brideName
              if (id === 'partner_2') return groomName
              return people.find(p => p.id === id)?.name ?? null
            }).filter(Boolean).join(', ')
            return names ? <Row label="Speakers" value={names} /> : null
          })()}
          {plan?.speeches_notes && <Row label="Speech notes" value={plan.speeches_notes} />}
          {plan?.meal_entertainment && plan?.meal_entertainment_notes && <Row label="Meal entertainment" value={plan.meal_entertainment_notes} />}
          {plan?.first_dance_style && <Row label="First dance" value={firstDanceLabel(plan.first_dance_style)} />}
          {plan?.first_dance_choreographed && plan?.first_dance_notes && <Row label="Choreography" value={plan.first_dance_notes} />}
          {plan?.first_songs && <Row label="First four songs" value={plan.first_songs} />}
          <Flag label="Daddy-daughter dance" yes={plan?.daddy_daughter_dance ?? false} />
          {!twoGrooms && <Flag label="Second dress" yes={plan?.second_dress ?? false} />}
          {!twoGrooms && plan?.second_dress && (
            <Row
              label="Second dress timing"
              value={
                plan.second_dress_notes === 'before_fourth' ? 'Changing before the 4th song — capture required'
                : plan.second_dress_notes === 'after_fourth' ? 'Changing after the 4th song — outside current coverage'
                : plan.second_dress_notes ?? null
              }
            />
          )}
          <Flag label="Outfit change before leaving" yes={plan?.leaving_outfit_change ?? false} />
          {plan?.leaving_outfit_change && plan?.leaving_outfit_change_notes && <Row label="Change details" value={plan.leaving_outfit_change_notes} />}
          <Flag label="Evening outdoor shots" yes={plan?.evening_outdoor_shots ?? false} />
          {plan?.evening_outdoor_shots && plan?.evening_outdoor_notes && <Row label="Evening location" value={plan.evening_outdoor_notes} />}
          <Flag label="Sparklers or fireworks" yes={plan?.sparklers_fireworks ?? false} />
          {plan?.sparklers_fireworks && plan?.sparklers_fireworks_type && (
            <Row label="Type" value={plan.sparklers_fireworks_type === 'sparklers' ? 'Sparklers' : 'Fireworks'} />
          )}
          {plan?.sparklers_fireworks_type === 'sparklers' && plan?.sparklers_who && (
            <Row label="Who joins" value={sparklerWhoLabel(plan.sparklers_who)} />
          )}
        </BriefSection>

        {suppliers.length > 0 && (
          <BriefSection n={twoPhotographers ? '09' : '08'} title="Suppliers">
            <div className="space-y-0">
              {suppliers.map(p => (
                <div key={p.id} className="flex items-start gap-3 py-2 border-b border-hairline/40 last:border-0">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-ink">{p.name}</span>
                    <span className="text-[10px] tracking-label uppercase text-mauve ml-2">{roleLabel(p.role, p.notes)}</span>
                    {p.email && <span className="text-xs text-whisper block mt-0.5">{p.email}</span>}
                  </div>
                  {p.phone && <a href={`tel:${p.phone}`} className="text-sm text-mauve flex-shrink-0">{p.phone}</a>}
                </div>
              ))}
            </div>
          </BriefSection>
        )}

        <div className="pt-8 pb-4 flex justify-center">
          <img src="/brand/Inner Circle.svg" alt="4Ever Inner Circle" className="h-8 w-auto opacity-30" />
        </div>

      </div>
    </main>
  )
}

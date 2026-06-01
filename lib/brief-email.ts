import { ROLES } from '@/content/roles'

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

function roleLabel(slug: string | null, notes?: string | null): string {
  if (!slug) return ''
  if (slug === 'supplier_other' && notes) return notes
  return ROLES.find(r => r.slug === slug)?.label ?? slug
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

function speechesTimingLabel(v: string | null) {
  if (v === 'after_call_in') return 'Straight after call in'
  if (v === 'after_starter') return 'After starter'
  if (v === 'after_dinner') return 'After dinner'
  return null
}

function firstDanceLabel(v: string | null) {
  if (v === 'alone') return 'Dancing to the full song — couple only'
  if (v === 'invite_bridal_party') return 'Bridal party joining halfway through'
  return null
}

function sparklerWhoLabel(v: string | null) {
  if (v === 'few_friends') return 'A few close friends'
  if (v === 'everyone') return 'Everyone out together'
  return null
}

function generateFamilyGroups(people: BriefPerson[], brideName: string, groomName: string): string[] {
  const family = people.filter(p => {
    const rg = ROLES.find(r => r.slug === p.role)?.group
    return p.is_family && rg !== 'bridal_party'
  })
  const bSide = family.filter(p => p.side === 'partner_1')
  const gSide = family.filter(p => p.side === 'partner_2')
  const names = (arr: BriefPerson[]) => arr.map(p => p.name).join(', ')

  const bParents = bSide.filter(p => ['Mum','Dad','Step-mum','Step-dad'].includes(p.family_relationship ?? ''))
  const gParents = gSide.filter(p => ['Mum','Dad','Step-mum','Step-dad'].includes(p.family_relationship ?? ''))
  const bSiblings = bSide.filter(p => ['Sister','Brother','Step-sister','Step-brother'].includes(p.family_relationship ?? ''))
  const gSiblings = gSide.filter(p => ['Sister','Brother','Step-sister','Step-brother'].includes(p.family_relationship ?? ''))
  const bSibPartners = bSide.filter(p => p.family_relationship === 'Partner' && p.in_family_photos)
  const gSibPartners = gSide.filter(p => p.family_relationship === 'Partner' && p.in_family_photos)
  const bGrandparents = bSide.filter(p => ['Grandmother','Grandfather','Step-grandmother','Step-grandfather'].includes(p.family_relationship ?? ''))
  const gGrandparents = gSide.filter(p => ['Grandmother','Grandfather','Step-grandmother','Step-grandfather'].includes(p.family_relationship ?? ''))

  const shots: string[] = []
  if (bParents.length > 0) shots.push(`Couple with ${brideName}'s parents — ${names(bParents)}`)
  if (bParents.length > 0 && gParents.length > 0) shots.push(`Couple with both sets of parents — ${names([...bParents, ...gParents])}`)
  if (gParents.length > 0) shots.push(`Couple with ${groomName}'s parents — ${names(gParents)}`)
  const bImmediateAll = [...bParents, ...bSiblings, ...bSibPartners]
  if (bImmediateAll.length > 0) shots.push(`${brideName}'s immediate family — ${names(bImmediateAll)}`)
  if (bParents.length > 0 && bSiblings.length > 0) shots.push(`${brideName} with parents and siblings — ${names([...bParents, ...bSiblings])}`)
  if (bParents.length >= 2) shots.push(`${brideName}'s parents together — ${names(bParents)}`)
  if (bSiblings.length > 0) shots.push(`${brideName} with siblings — ${names([...bSiblings, ...bSibPartners])}`)
  const gImmediateAll = [...gParents, ...gSiblings, ...gSibPartners]
  if (gImmediateAll.length > 0) shots.push(`${groomName}'s immediate family — ${names(gImmediateAll)}`)
  if (gParents.length > 0 && gSiblings.length > 0) shots.push(`${groomName} with parents and siblings — ${names([...gParents, ...gSiblings])}`)
  if (gParents.length >= 2) shots.push(`${groomName}'s parents together — ${names(gParents)}`)
  if (gSiblings.length > 0) shots.push(`${groomName} with siblings — ${names([...gSiblings, ...gSibPartners])}`)
  bGrandparents.forEach(gp => shots.push(`Couple with ${gp.name} (${brideName}'s side)`))
  gGrandparents.forEach(gp => shots.push(`Couple with ${gp.name} (${groomName}'s side)`))
  return shots
}

// ─── Email building blocks ────────────────────────────────────────────────────

function sectionHeader(number: string, title: string) {
  return `
    <tr>
      <td style="padding:28px 24px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="border-top:1px solid #E8DDD8;padding-top:16px;">
              <span style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#C49AAA;">${number}</span>
              <span style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#A86B85;margin-left:10px;">${title}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

function row(label: string, value: string | null | undefined, link?: string) {
  if (!value) return ''
  const cell = link
    ? `<a href="${link}" style="color:#A86B85;text-decoration:none;font-size:14px;line-height:1.5;">${value} ↗</a>`
    : `<span style="color:#2E3528;font-size:14px;line-height:1.5;">${value}</span>`
  return `
    <tr>
      <td style="padding:6px 24px;border-bottom:1px solid #F0E8E4;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="110" style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#C49AAA;vertical-align:top;padding-top:2px;">${label}</td>
            <td style="font-family:Georgia,'Times New Roman',serif;">${cell}</td>
          </tr>
        </table>
      </td>
    </tr>`
}

function flag(label: string, yes: boolean) {
  if (!yes) return ''
  return `
    <tr>
      <td style="padding:6px 24px;border-bottom:1px solid #F0E8E4;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="110" style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#C49AAA;vertical-align:top;padding-top:2px;">${label}</td>
            <td><span style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;border:1px solid #4A1F3D;color:#4A1F3D;padding:2px 8px;">Yes</span></td>
          </tr>
        </table>
      </td>
    </tr>`
}

function personRow(p: BriefPerson) {
  const role = roleLabel(p.role, p.notes)
  const child = p.child_name ? ` — ${p.role === 'flower_girl_guardian' ? 'Flower girl' : 'Page boy'}: ${p.child_name}` : ''
  const phone = p.phone
    ? `<a href="tel:${p.phone}" style="color:#A86B85;text-decoration:none;font-size:14px;font-family:Georgia,'Times New Roman',serif;">${p.phone}</a>`
    : ''
  return `
    <tr>
      <td style="padding:8px 24px;border-bottom:1px solid #F0E8E4;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#2E3528;">
              ${p.name}
              ${role ? `<span style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#A86B85;margin-left:8px;">${role}</span>` : ''}
              ${child ? `<span style="font-family:Georgia,'Times New Roman',serif;font-size:12px;color:#C49AAA;font-style:italic;">${child}</span>` : ''}
            </td>
            <td align="right">${phone}</td>
          </tr>
        </table>
      </td>
    </tr>`
}

function subheading(text: string) {
  return `
    <tr>
      <td style="padding:16px 24px 4px;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#C49AAA;">${text}</p>
      </td>
    </tr>`
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function buildBriefEmailHtml(
  couple: BriefCouple,
  people: BriefPerson[],
  shots: BriefShot[],
  plan: BriefDayPlan | null,
): string {
  const { bride_name: brideName, groom_name: groomName } = couple

  const twoPhotographers = plan?.photographer_count === 2
  const partner1IsMale = couple.partner_1_gender === 'man'
  const partner2IsFemale = couple.partner_2_gender === 'woman'
  const twoGrooms = couple.partner_1_gender === 'man' && couple.partner_2_gender === 'man'
  const sameSeхCouple = twoGrooms || (couple.partner_1_gender === 'woman' && couple.partner_2_gender === 'woman')

  const weddingDate = couple.wedding_date
    ? new Date(couple.wedding_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  const BRIDE_PARTY_ROLES = ['maid_of_honour', 'bridesmaid', 'flower_girl_guardian']
  const GROOM_PARTY_ROLES = ['best_man', 'groomsman', 'usher', 'page_boy_guardian']

  const brideParty = people.filter(p => BRIDE_PARTY_ROLES.includes(p.role ?? ''))
  const groomParty = people.filter(p => GROOM_PARTY_ROLES.includes(p.role ?? ''))
  const suppliers = people.filter(p => ROLES.find(r => r.slug === p.role)?.group === 'supplier')
  const familyGroups = generateFamilyGroups(people, brideName, groomName)

  const brideFamily = people.filter(p => {
    const rg = ROLES.find(r => r.slug === p.role)?.group
    return (p.is_family || rg === 'family') && rg !== 'bridal_party' && p.side === 'partner_1'
  })
  const groomFamily = people.filter(p => {
    const rg = ROLES.find(r => r.slug === p.role)?.group
    return (p.is_family || rg === 'family') && rg !== 'bridal_party' && p.side === 'partner_2'
  })

  let n = 0
  const nextN = () => String(++n).padStart(2, '0')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Photographer's Brief — ${brideName} &amp; ${groomName}</title>
</head>
<body style="margin:0;padding:0;background:#FAF4F0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FAF4F0">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

  <!-- Header -->
  <tr>
    <td bgcolor="#4A1F3D" style="padding:32px 24px 28px;">
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#C49AAA;">Photographer's Brief — Confidential</p>
      <h1 style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:400;color:#FAF4F0;line-height:1.2;">${brideName} &amp; ${groomName}</h1>
      <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:15px;font-style:italic;color:#FAF4F0;opacity:0.75;">${weddingDate}</p>
      ${plan?.photographer_count ? `<p style="margin:0;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:#A86B85;">${plan.photographer_count === 2 ? '2 Photographers' : '1 Photographer'}${plan.guest_count ? ` &nbsp;·&nbsp; ${plan.guest_count} Guests` : ''}</p>` : ''}
    </td>
  </tr>
  <tr><td bgcolor="#A86B85" style="height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- Locations -->
  ${sectionHeader('★', 'Locations')}
  ${plan?.bride_prep_address ? row('Bridal prep', plan.bride_prep_address, mapsUrl(plan.bride_prep_address)) : ''}
  ${twoPhotographers && plan?.groom_prep_address ? row('Groom prep', plan.groom_prep_address, mapsUrl(plan.groom_prep_address)) : ''}
  ${couple.ceremony_address ? row('Ceremony', `${couple.ceremony_name ? couple.ceremony_name + ', ' : ''}${couple.ceremony_address}`, mapsUrl(couple.ceremony_address)) : ''}
  ${plan?.photo_shoot_address ? row('Photo shoot', plan.photo_shoot_address, mapsUrl(plan.photo_shoot_address)) : ''}
  ${couple.venue_address ? row('Reception', `${couple.venue_name ? couple.venue_name + ', ' : ''}${couple.venue_address}`, mapsUrl(couple.venue_address)) : ''}
  ${plan?.special_visit && plan?.special_visit_address ? row('Special visit', plan.special_visit_address, mapsUrl(plan.special_visit_address)) : ''}

  <!-- Bride's Morning -->
  ${sectionHeader(nextN(), `${brideName}'s Morning`)}
  ${sameSeхCouple ? flag('Getting ready together', plan?.getting_ready_together ?? false) : ''}
  ${flag('Children joining', plan?.bride_has_children ?? false)}
  ${plan?.bride_has_children && plan?.bride_children_ages ? row('Ages', plan.bride_children_ages) : ''}
  ${plan?.bride_has_children && plan?.bride_children_needs ? row('Special needs', plan.bride_children_needs) : ''}
  ${!partner1IsMale ? flag('Dad reveal', plan?.bride_dad_reveal ?? false) : ''}
  ${!partner1IsMale ? flag('Bridesmaids reveal', plan?.bride_bridesmaids_reveal ?? false) : ''}
  ${flag('Pub stop', plan?.bride_pub_stop ?? false)}
  ${flag('Gift giving', plan?.bride_gifts ?? false)}
  ${plan?.bride_gifts_notes ? row('Gift notes', plan.bride_gifts_notes) : ''}
  ${plan?.bride_prep_location_notes ? row('Location notes', plan.bride_prep_location_notes) : ''}
  ${plan?.bride_personality_notes ? row('Personality', plan.bride_personality_notes) : ''}
  ${brideParty.length > 0 ? subheading(`${brideName}'s party`) : ''}
  ${brideParty.map(p => personRow(p)).join('')}

  <!-- Groom's Morning (2 photographers only) -->
  ${twoPhotographers && !(plan?.getting_ready_together) ? `
  ${sectionHeader(nextN(), `${groomName}'s Morning`)}
  ${flag('Children joining', plan?.groom_has_children ?? false)}
  ${plan?.groom_has_children && plan?.groom_children_ages ? row('Ages', plan.groom_children_ages) : ''}
  ${plan?.groom_has_children && plan?.groom_children_needs ? row('Special needs', plan.groom_children_needs) : ''}
  ${!partner2IsFemale ? flag('Dad reveal', plan?.groom_dad_reveal ?? false) : ''}
  ${!partner2IsFemale ? flag('Bridesmaids reveal', plan?.groom_bridesmaids_reveal ?? false) : ''}
  ${flag('Pub stop', plan?.groom_pub_stop ?? false)}
  ${flag('Gift giving', plan?.groom_gifts ?? false)}
  ${plan?.groom_gifts_notes ? row('Gift notes', plan.groom_gifts_notes) : ''}
  ${plan?.groom_prep_location_notes ? row('Location notes', plan.groom_prep_location_notes) : ''}
  ${plan?.groom_personality_notes ? row('Personality', plan.groom_personality_notes) : ''}
  ${groomParty.length > 0 ? subheading(`${groomName}'s party`) : ''}
  ${groomParty.map(p => personRow(p)).join('')}
  ` : ''}

  <!-- Ceremony -->
  ${sectionHeader(nextN(), 'The Ceremony')}
  ${couple.ceremony_address ? row('Location', `${couple.ceremony_name ? couple.ceremony_name + ', ' : ''}${couple.ceremony_address}`, mapsUrl(couple.ceremony_address)) : ''}
  ${sameSeхCouple && plan?.aisle_entrance_style ? row('Aisle entrance', plan.aisle_entrance_style === 'together' ? 'Walking in together' : 'One partner entering first, then the other') : ''}
  ${flag('Altar shot', plan?.altar_shot ?? false)}
  ${flag('Dip at exit', plan?.ceremony_dip ?? false)}
  ${flag('Confetti', plan?.confetti ?? false)}
  ${plan?.confetti_notes ? row('Confetti notes', plan.confetti_notes) : ''}
  ${plan?.post_ceremony_style ? row('After ceremony', postCeremonyLabel(plan.post_ceremony_style)) : ''}
  ${plan?.ceremony_special_moments ? row('Special moments', plan.ceremony_special_moments) : ''}
  ${plan?.celebrant_notes ? row('Celebrant', plan.celebrant_notes) : ''}
  ${plan?.post_ceremony_refreshments && plan?.post_ceremony_refreshments_notes ? row('Refreshments', plan.post_ceremony_refreshments_notes) : ''}

  <!-- Photo Shoot -->
  ${sectionHeader(nextN(), 'The Photo Shoot')}
  ${plan?.photo_shoot_address ? row('Location', plan.photo_shoot_address, mapsUrl(plan.photo_shoot_address)) : ''}
  ${plan?.photo_shoot_attendees ? row('Who attends', shootAttendeesLabel(plan.photo_shoot_attendees)) : ''}
  ${plan?.photo_shoot_notes ? row('Notes', plan.photo_shoot_notes) : ''}

  <!-- Family Groups — working checklist -->
  ${sectionHeader(nextN(), 'Family Groups')}
  ${familyGroups.length === 0 ? `
  <tr><td style="padding:12px 24px;">
    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:13px;font-style:italic;color:#C49AAA;">No family members added yet.</p>
  </td></tr>` : familyGroups.map((shot, i) => `
  <tr>
    <td style="padding:0 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #F0E8E4;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="32" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#A86B85;vertical-align:top;padding-top:1px;">${String(i + 1).padStart(2, '0')}</td>
                <td style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#2E3528;line-height:1.4;">${shot}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>`).join('')}

  ${brideFamily.length > 0 || groomFamily.length > 0 ? `
  ${subheading('Family contacts')}
  ${[...brideFamily, ...groomFamily].map(p => personRow(p)).join('')}
  ` : ''}

  <!-- Shot Requests -->
  ${shots.length > 0 ? `
  ${sectionHeader(nextN(), 'Shot Requests')}
  ${shots.map((shot, i) => `
  <tr>
    <td style="padding:8px 24px;border-bottom:1px solid #F0E8E4;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="32" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#A86B85;vertical-align:top;padding-top:2px;">${String(i + 1).padStart(2, '0')}</td>
          <td>
            <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#2E3528;">${shot.label}</p>
            ${shot.people ? `<p style="margin:2px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:13px;color:#888;">${shot.people}</p>` : ''}
            ${shot.notes ? `<p style="margin:2px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:12px;font-style:italic;color:#C49AAA;">${shot.notes}</p>` : ''}
          </td>
        </tr>
      </table>
    </td>
  </tr>`).join('')}
  ` : ''}

  <!-- Reception -->
  ${sectionHeader(nextN(), 'The Reception')}
  ${couple.venue_address ? row('Venue', `${couple.venue_name ? couple.venue_name + ', ' : ''}${couple.venue_address}`, mapsUrl(couple.venue_address)) : ''}
  ${plan?.room_entrance_style ? row('Room entrance', roomEntranceLabel(plan.room_entrance_style)) : ''}
  ${plan?.room_entrance_notes ? row('Entrance notes', plan.room_entrance_notes) : ''}
  ${plan?.speeches_timing ? row('Speeches', speechesTimingLabel(plan.speeches_timing)) : ''}
  ${plan?.speeches_notes ? row('Speech notes', plan.speeches_notes) : ''}
  ${plan?.meal_entertainment && plan?.meal_entertainment_notes ? row('Meal entertainment', plan.meal_entertainment_notes) : ''}
  ${plan?.first_dance_style ? row('First dance', firstDanceLabel(plan.first_dance_style)) : ''}
  ${plan?.first_songs ? row('First four songs', plan.first_songs) : ''}
  ${flag('Daddy-daughter dance', plan?.daddy_daughter_dance ?? false)}
  ${!twoGrooms ? flag('Second dress', plan?.second_dress ?? false) : ''}
  ${!twoGrooms && plan?.second_dress ? row('Second dress timing', plan.second_dress_notes === 'before_fourth' ? 'Changing before 4th song — capture required' : plan.second_dress_notes === 'after_fourth' ? 'Changing after 4th song — outside coverage' : plan.second_dress_notes ?? null) : ''}
  ${flag('Outfit change before leaving', plan?.leaving_outfit_change ?? false)}
  ${plan?.leaving_outfit_change && plan?.leaving_outfit_change_notes ? row('Change details', plan.leaving_outfit_change_notes) : ''}
  ${flag('Evening outdoor shots', plan?.evening_outdoor_shots ?? false)}
  ${plan?.evening_outdoor_shots && plan?.evening_outdoor_notes ? row('Evening location', plan.evening_outdoor_notes) : ''}
  ${flag('Sparklers or fireworks', plan?.sparklers_fireworks ?? false)}
  ${plan?.sparklers_fireworks && plan?.sparklers_fireworks_type ? row('Type', plan.sparklers_fireworks_type === 'sparklers' ? 'Sparklers' : 'Fireworks') : ''}
  ${plan?.sparklers_fireworks_type === 'sparklers' && plan?.sparklers_who ? row('Who joins', sparklerWhoLabel(plan.sparklers_who)) : ''}

  <!-- Suppliers -->
  ${suppliers.length > 0 ? `
  ${sectionHeader(nextN(), 'Suppliers')}
  ${suppliers.map(p => personRow(p)).join('')}
  ` : ''}

  <!-- Footer -->
  <tr>
    <td bgcolor="#4A1F3D" style="padding:20px 24px;text-align:center;margin-top:32px;">
      <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:12px;font-style:italic;color:#C49AAA;">
        The best wedding photographs begin long before we press the shutter.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

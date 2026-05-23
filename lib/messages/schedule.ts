import { createAdminClient } from '@/lib/supabase'
import { buildVars, renderTemplate } from './render'

type Person = {
  id: string
  name: string
  role: string | null
  email: string | null
  phone: string | null
}

type Couple = {
  id: string
  bride_name: string
  groom_name: string
  wedding_date: string | null
  venue_name: string | null
  venue_address: string | null
  ceremony_name: string | null
  ceremony_address: string | null
  bride_prep_address?: string | null
}

function addDays(dateStr: string, days: number): Date {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d
}

export async function scheduleMessagesForPerson(
  person: Person,
  couple: Couple,
  signupDate: Date = new Date()
) {
  if (!person.role) return

  const supabase = createAdminClient()

  const { data: templates } = await supabase
    .from('message_templates')
    .select('*')
    .eq('recipient_role', person.role)
    .eq('active', true)

  if (!templates || templates.length === 0) return

  const vars = buildVars({
    personName: person.name,
    brideName: couple.bride_name,
    groomName: couple.groom_name,
    weddingDate: couple.wedding_date,
    venueName: couple.venue_name,
    venueAddress: couple.venue_address,
    ceremonyName: couple.ceremony_name,
    ceremonyAddress: couple.ceremony_address,
    bridePrep: couple.bride_prep_address ?? null,
  })

  const now = new Date()

  for (const template of templates) {
    const triggerType = template.trigger_type ?? 'wedding_date'

    let sendDate: Date

    if (triggerType === 'on_signup') {
      sendDate = addDays(signupDate.toISOString().split('T')[0], template.send_offset_days)
    } else {
      // wedding_date trigger — skip if no wedding date set
      if (!couple.wedding_date) continue
      sendDate = addDays(couple.wedding_date, template.send_offset_days)
    }

    const [hours, minutes] = (template.send_time ?? '09:30').split(':').map(Number)
    sendDate.setHours(hours, minutes, 0, 0)

    if (sendDate < now) continue

    const body = renderTemplate(template.body, vars)
    const subject = template.subject ? renderTemplate(template.subject, vars) : null

    await supabase.from('scheduled_messages').upsert({
      couple_id: couple.id,
      person_id: person.id,
      template_id: template.template_key,
      channel: template.channel,
      recipient_name: person.name,
      recipient_email: person.email,
      recipient_phone: person.phone,
      send_at: sendDate.toISOString(),
      status: 'pending',
      subject,
      body,
    }, {
      onConflict: 'couple_id,person_id,template_id',
      ignoreDuplicates: false,
    })
  }
}

export async function scheduleAllMessagesForCouple(coupleId: string) {
  const supabase = createAdminClient()

  const { data: couple } = await supabase
    .from('couples')
    .select('id, bride_name, groom_name, wedding_date, venue_name, venue_address, ceremony_name, ceremony_address')
    .eq('id', coupleId)
    .single()

  if (!couple) return

  const { data: people } = await supabase
    .from('people')
    .select('id, name, role, email, phone')
    .eq('couple_id', coupleId)

  for (const person of people ?? []) {
    await scheduleMessagesForPerson(person, couple)
  }
}

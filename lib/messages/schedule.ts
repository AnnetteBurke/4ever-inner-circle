import { createAdminClient } from '@/lib/supabase'
import { MESSAGE_TEMPLATES } from '@/content/messages'
import type { RoleSlug } from '@/content/roles'
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

export async function scheduleMessagesForPerson(person: Person, couple: Couple) {
  if (!couple.wedding_date) return
  if (!person.role) return

  const supabase = createAdminClient()
  const role = person.role as RoleSlug

  const templates = MESSAGE_TEMPLATES.filter(t =>
    Array.isArray(t.recipientRole)
      ? t.recipientRole.includes(role)
      : t.recipientRole === role
  )

  if (templates.length === 0) return

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
    const sendDate = addDays(couple.wedding_date, template.sendOffsetDays)
    const [hours, minutes] = (template.sendTime ?? '09:30').split(':').map(Number)
    sendDate.setHours(hours, minutes, 0, 0)

    // Skip if the send date has already passed
    if (sendDate < now) continue

    const body = renderTemplate(template.body, vars)
    const subject = template.subject ? renderTemplate(template.subject, vars) : null

    // Upsert — if this message was already scheduled, update it
    await supabase.from('scheduled_messages').upsert({
      couple_id: couple.id,
      person_id: person.id,
      template_id: template.id,
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

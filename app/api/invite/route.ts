import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { scheduleMessagesForPerson } from '@/lib/messages/schedule'

export async function POST(request: Request) {
  const {
    email,
    brideName,
    groomName,
    partner1Gender,
    partner2Gender,
    weddingDate,
    venueName,
    venueSlug,
    venueAddress,
    ceremonyName,
    ceremonyAddress,
  } = await request.json()

  if (!email || !brideName || !groomName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    data: { bride_name: brideName, groom_name: groomName },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: couple, error: insertError } = await supabase.from('couples').insert({
    user_id: data.user.id,
    bride_name: brideName,
    groom_name: groomName,
    partner_1_gender: partner1Gender || 'woman',
    partner_2_gender: partner2Gender || 'man',
    wedding_date: weddingDate || null,
    venue_name: venueName || null,
    venue_slug: venueSlug || null,
    venue_address: venueAddress || null,
    ceremony_name: ceremonyName || null,
    ceremony_address: ceremonyAddress || null,
  }).select().single()

  if (insertError || !couple) {
    return NextResponse.json({ error: insertError?.message ?? 'Failed to create couple' }, { status: 500 })
  }

  // Auto-add the bride as a person so on_signup messages fire immediately
  const brideRole = (partner1Gender === 'man') ? 'groom' : 'bride'
  const { data: bridePerson } = await supabase.from('people').insert({
    couple_id: couple.id,
    name: brideName,
    role: brideRole,
    email: email,
  }).select().single()

  if (bridePerson) {
    scheduleMessagesForPerson(bridePerson, couple, new Date()).catch(() => {})
  }

  return NextResponse.json({ success: true })
}

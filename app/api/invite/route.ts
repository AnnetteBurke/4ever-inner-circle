import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

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

  const { error: insertError } = await supabase.from('couples').insert({
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
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

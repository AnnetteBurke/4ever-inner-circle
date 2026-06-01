import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { scheduleMessagesForPerson } from '@/lib/messages/schedule'
import { sendEmail } from '@/lib/resend'
import { sendSms } from '@/lib/twilio'

export async function POST(request: Request) {
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  const adminEmail = process.env.ADMIN_MAIL

  if (!user || !adminEmail || user.email !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const {
    email,
    brideName,
    groomName,
    partner1Gender,
    partner2Gender,
    partner1Mobile,
    partner2Mobile,
    partner2Email,
    weddingDate,
    ceremonyTime,
    venueName,
    venueSlug,
    venueAddress,
    ceremonyName,
    ceremonyAddress,
    bridePrep,
    groomPrep,
    secondPhotographerEmail,
  } = await request.json()

  if (!email || !brideName || !groomName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Create the user and get the invite link so we can send our own branded email
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/set-password`,
      data: { bride_name: brideName, groom_name: groomName },
    },
  })

  if (linkError) {
    return NextResponse.json({ error: linkError.message }, { status: 500 })
  }

  const inviteUrl = linkData.properties.action_link

  // Send our own branded invitation email via Resend
  await sendEmail({
    to: email,
    subject: `${brideName}, your 4Ever Inner Circle is ready`,
    ctaUrl: inviteUrl,
    ctaLabel: 'Open your Inner Circle',
    body: `Hi ${brideName},

Thank you so much for booking 4Ever Photos for your wedding. We are genuinely excited to be part of your day.

We have created something really special for you — your own 4Ever Inner Circle. It is a private platform built with the latest technology and designed entirely around you and ${groomName}. Everything in one place, bespoke to your wedding, accessible anytime from your phone.

Inside you will find your day plan, your shot requests, your people all briefed and looked after, and a whole lot more waiting for you.

To get started, just press the button below and you are in.

{{CTA}}

We cannot wait to show you what we have built for you.`,
  })

  // Create the couple record
  const { data: couple, error: insertError } = await supabase.from('couples').insert({
    user_id: linkData.user.id,
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
    bride_mobile: partner1Mobile || null,
    groom_mobile: partner2Mobile || null,
    groom_email: partner2Email || null,
    ceremony_time: ceremonyTime || null,
    bride_prep_address: bridePrep || null,
    groom_prep_address: groomPrep || null,
    second_photographer_email: secondPhotographerEmail || null,
  }).select().single()

  if (insertError || !couple) {
    return NextResponse.json({ error: insertError?.message ?? 'Failed to create couple' }, { status: 500 })
  }

  // Auto-add partner 1 as a person so on_signup messages fire immediately
  const p1Role = partner1Gender === 'man' ? 'groom' : 'bride'
  const { data: p1Person } = await supabase.from('people').insert({
    couple_id: couple.id,
    name: brideName,
    role: p1Role,
    email: email,
    phone: partner1Mobile || null,
  }).select().single()

  if (p1Person) {
    scheduleMessagesForPerson(p1Person, couple, new Date()).catch(() => {})
  }

  // Auto-add partner 2 if we have enough details
  if (groomName && (partner2Email || partner2Mobile)) {
    const p2Role = partner2Gender === 'woman' ? 'bride' : 'groom'
    await supabase.from('people').insert({
      couple_id: couple.id,
      name: groomName,
      role: p2Role,
      email: partner2Email || null,
      phone: partner2Mobile || null,
    })
  }

  // Send SMS nudge to partner 1 to check their inbox
  // (WhatsApp requires Meta Business API approval — using SMS until that is live)
  let smsResult: { ok: boolean; error?: string } = { ok: false, error: 'No mobile number provided' }
  if (partner1Mobile) {
    const firstName = brideName.split(' ')[0]
    smsResult = await sendSms({
      to: partner1Mobile,
      body: `Hi ${firstName}! An invitation email has just landed in your inbox from studio@4ever.photos. If you don't see it in the next few minutes, check your junk or spam folder. So excited to have you in the Inner Circle! Annette x`,
    })
    if (!smsResult.ok) {
      console.error('SMS failed:', smsResult.error)
    }
  }

  return NextResponse.json({ success: true, sms: smsResult })
}

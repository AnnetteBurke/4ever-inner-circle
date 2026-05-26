import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/resend'
import { sendWhatsApp } from '@/lib/twilio'

export async function POST() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const adminClient = createAdminClient()

  const { data: couple } = await adminClient
    .from('couples')
    .select('bride_name, groom_name, bride_mobile')
    .eq('user_id', user.id)
    .single()

  if (!couple) return NextResponse.json({ error: 'Couple not found' }, { status: 404 })

  const firstName = couple.bride_name.split(' ')[0]
  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/login`

  // Confirmation email
  await sendEmail({
    to: user.email!,
    subject: 'You are in — your sign-in details',
    ctaUrl: loginUrl,
    ctaLabel: 'Sign in to my Inner Circle',
    body: `Hi ${firstName},

You are all set. Your password is saved and your Inner Circle is open.

Whenever you want back in, just head to the sign-in page using the button below. Your email address and the password you just created will get you straight through.

{{CTA}}

Keep this email safe — it is your way back in from any device, any time.

We are so excited to be on this journey with you.`,
  })

  // Confirmation WhatsApp
  if (couple.bride_mobile) {
    await sendWhatsApp({
      to: couple.bride_mobile,
      body: `Hi ${firstName}! You are all set up. Your password is saved so you can get back into your private Inner Circle any time at ${loginUrl}

Save that link — it is your home from here. Cannot wait to see everything come together for you! Annette x`,
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}

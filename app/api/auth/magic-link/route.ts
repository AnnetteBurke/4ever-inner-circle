import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/resend'

export async function POST(request: Request) {
  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabase = createAdminClient()

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm` },
  })

  // Always return success — don't reveal whether the email is registered
  if (error || !data) return NextResponse.json({ success: true })

  const magicLink = data.properties.action_link

  await sendEmail({
    to: email,
    subject: 'Your 4Ever Inner Circle sign-in link',
    ctaUrl: magicLink,
    ctaLabel: 'Open my Inner Circle',
    body: `Here is your sign-in link for your 4Ever Inner Circle.

{{CTA}}

This link will take you straight back into your private space. It can only be used once — if you need another, just visit the sign-in page and request a fresh one.

If you did not request this, you can safely ignore this email.`,
  })

  return NextResponse.json({ success: true })
}

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(request: Request) {
  const { email, brideName, groomName } = await request.json()

  if (!email || !brideName || !groomName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    data: { bride_name: brideName, groom_name: groomName },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('couples').insert({
    user_id: data.user.id,
    bride_name: brideName,
    groom_name: groomName,
  })

  return NextResponse.json({ success: true })
}

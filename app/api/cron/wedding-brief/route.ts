import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { Resend } from 'resend'
import { buildBriefEmailHtml } from '@/lib/brief-email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PHOTOGRAPHER_EMAIL = 'studio@4ever.photos'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Find weddings happening in 2 days
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 2)
  const dateStr = targetDate.toISOString().split('T')[0]

  const { data: couples, error } = await supabase
    .from('couples')
    .select('id, bride_name, groom_name, partner_1_gender, partner_2_gender, wedding_date, venue_name, venue_address, ceremony_name, ceremony_address')
    .eq('wedding_date', dateStr)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!couples || couples.length === 0) {
    return NextResponse.json({ sent: 0, message: `No weddings on ${dateStr}` })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  let sent = 0

  for (const couple of couples) {
    const [peopleRes, shotsRes, planRes] = await Promise.all([
      supabase.from('people').select('*').eq('couple_id', couple.id).order('created_at', { ascending: true }),
      supabase.from('shot_requests').select('*').eq('couple_id', couple.id).order('created_at', { ascending: true }),
      supabase.from('day_plan').select('*').eq('couple_id', couple.id).single(),
    ])

    const html = buildBriefEmailHtml(
      couple,
      peopleRes.data ?? [],
      shotsRes.data ?? [],
      planRes.data ?? null,
    )

    const weddingDateFormatted = new Date(couple.wedding_date!).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

    await resend.emails.send({
      from: `4Ever Inner Circle <studio@4ever.photos>`,
      to: PHOTOGRAPHER_EMAIL,
      subject: `Brief — ${couple.bride_name} & ${couple.groom_name} — ${weddingDateFormatted}`,
      html,
      text: `Photographer's Brief\n${couple.bride_name} & ${couple.groom_name}\n${weddingDateFormatted}\n\nOpen this email in a mail app to view the full brief.`,
    })

    sent++
  }

  return NextResponse.json({ sent, date: dateStr })
}

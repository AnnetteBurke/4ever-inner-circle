import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('message_templates')
    .select('*')
    .order('recipient_role', { ascending: true })
    .order('send_offset_days', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createAdminClient()
  const body = await request.json()

  const { template_key, recipient_role, channel, send_offset_days, send_time, subject, body: msgBody, notes, active } = body

  if (!template_key || !recipient_role || !channel || !msgBody) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('message_templates')
    .insert({
      template_key,
      recipient_role,
      channel,
      send_offset_days: send_offset_days ?? -28,
      send_time: send_time ?? '09:30',
      subject: subject || null,
      body: msgBody,
      notes: notes || null,
      active: active ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

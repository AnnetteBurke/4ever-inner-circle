import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('message_templates')
    .update({
      template_key: body.template_key,
      recipient_role: body.recipient_role,
      channel: body.channel,
      send_offset_days: body.send_offset_days,
      send_time: body.send_time,
      subject: body.subject || null,
      body: body.body,
      notes: body.notes || null,
      active: body.active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('message_templates')
    .delete()
    .eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

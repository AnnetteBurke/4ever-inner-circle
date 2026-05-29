import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/resend'
import { sendSms, sendWhatsApp } from '@/lib/twilio'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Protect the endpoint — only Vercel cron or a request with the secret can call this
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Find all messages due in the next hour that are still pending
  const now = new Date()
  const cutoff = new Date(now.getTime() + 60 * 60 * 1000)

  const { data: messages, error } = await supabase
    .from('scheduled_messages')
    .select('*')
    .eq('status', 'pending')
    .lte('send_at', cutoff.toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!messages || messages.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No messages due' })
  }

  let sent = 0
  let failed = 0
  const results: { id: string; status: string; error?: string }[] = []

  for (const msg of messages) {
    let result: { ok: boolean; error?: string }

    if (msg.channel === 'email') {
      if (!msg.recipient_email) {
        result = { ok: false, error: 'No email address on record' }
      } else {
        result = await sendEmail({
          to: msg.recipient_email,
          subject: msg.subject ?? '4Ever Photos',
          body: msg.body,
        })
      }
    } else if (msg.channel === 'sms') {
      if (!msg.recipient_phone) {
        result = { ok: false, error: 'No phone number on record' }
      } else {
        result = await sendSms({ to: msg.recipient_phone, body: msg.body })
      }
    } else if (msg.channel === 'whatsapp') {
      if (!msg.recipient_phone) {
        result = { ok: false, error: 'No phone number on record' }
      } else {
        result = await sendWhatsApp({ to: msg.recipient_phone, body: msg.body })
      }
    } else {
      result = { ok: false, error: `Unknown channel: ${msg.channel}` }
    }

    const newStatus = result.ok ? 'sent' : 'failed'
    await supabase
      .from('scheduled_messages')
      .update({
        status: newStatus,
        sent_at: result.ok ? new Date().toISOString() : null,
        error: result.error ?? null,
      })
      .eq('id', msg.id)

    if (result.ok) sent++
    else failed++

    results.push({ id: msg.id, status: newStatus, error: result.error })
  }

  return NextResponse.json({ sent, failed, results })
}

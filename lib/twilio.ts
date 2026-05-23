import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromSms = process.env.TWILIO_PHONE_NUMBER
const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM

export async function sendSms({
  to,
  body,
}: {
  to: string
  body: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!accountSid || !authToken || !fromSms) {
    return { ok: false, error: 'Twilio SMS not configured' }
  }
  try {
    const client = twilio(accountSid, authToken)
    await client.messages.create({ from: fromSms, to, body })
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

export async function sendWhatsApp({
  to,
  body,
}: {
  to: string
  body: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!accountSid || !authToken || !fromWhatsApp) {
    return { ok: false, error: 'Twilio WhatsApp not configured' }
  }
  try {
    const client = twilio(accountSid, authToken)
    await client.messages.create({
      from: fromWhatsApp,
      to: `whatsapp:${to}`,
      body,
    })
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'Annette at 4Ever <hello@4everphotos.uk>'

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string
  subject: string
  body: string
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      text: body,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

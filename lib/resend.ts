import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'Annette at 4Ever <studio@4ever.photos>'

function toParagraph(text: string) {
  const lines = text.trim().replace(/\n/g, '<br>')
  return `<p style="margin:0 0 20px;line-height:1.8;color:#2E3528;font-size:16px;font-family:Georgia,'Times New Roman',serif;">${lines}</p>`
}

function ctaButton(url: string, label: string) {
  return `<p style="margin:0 0 20px;text-align:center;">
    <a href="${url}" style="display:inline-block;background:#4A1F3D;color:#FAF4F0;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;padding:18px 48px;">${label}</a>
  </p>`
}

function buildEmailHtml(body: string, ctaUrl?: string, ctaLabel = 'Open your Inner Circle'): string {
  // Replace {{CTA}} marker with the button inline, then convert remaining text to paragraphs
  const processedBody = body
    .split(/\n\n+/)
    .map(para => {
      const trimmed = para.trim()
      if (trimmed === '{{CTA}}') {
        return ctaUrl ? ctaButton(ctaUrl, ctaLabel) : ''
      }
      return toParagraph(trimmed)
    })
    .join('')

  const ctaBlock = '' // button is now inline via {{CTA}} marker

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
</head>
<body style="margin:0;padding:0;background:#FAF4F0;font-family:Georgia,'Times New Roman',serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF4F0;width:100%;">
    <tr>
      <td align="center" style="padding:0;">

        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#4A1F3D;padding:32px;text-align:center;width:100%;">
              <img
                src="https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/brand/inner-circle-landscape.svg"
                alt="4Ever Inner Circle"
                style="display:block;margin:0 auto;width:200px;max-width:200px;"
              />
            </td>
          </tr>

          <!-- Hairline accent -->
          <tr>
            <td style="background:#A86B85;height:2px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#FAF4F0;padding:44px 32px 32px;">
              ${processedBody}
            </td>
          </tr>

          ${ctaBlock}

          <!-- Signature divider -->
          <tr>
            <td style="background:#FAF4F0;padding:0 32px;">
              <div style="border-top:1px solid #E8DDD8;"></div>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="background:#FAF4F0;padding:28px 32px 44px;">
              <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:13px;font-style:italic;color:#A86B85;">with love,</p>
              <p style="margin:0 0 20px;font-family:'Brush Script MT','Segoe Script','Apple Chancery',cursive;font-size:42px;color:#4A1F3D;line-height:1.1;">Annette x</p>
              <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-size:11px;color:#A86B85;letter-spacing:0.12em;text-transform:uppercase;">4Ever Photos</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#C49AAA;">studio@4ever.photos</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#4A1F3D;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:12px;font-style:italic;color:#C49AAA;line-height:1.6;">
                The best wedding photographs begin long before we press the shutter.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`
}

export async function sendEmail({
  to,
  subject,
  body,
  ctaUrl,
  ctaLabel,
}: {
  to: string
  subject: string
  body: string
  ctaUrl?: string
  ctaLabel?: string
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html: buildEmailHtml(body, ctaUrl, ctaLabel),
      text: body,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'Annette at 4Ever <studio@4ever.photos>'

function toParagraph(text: string) {
  const lines = text.trim().replace(/\n/g, '<br>')
  return `<p style="margin:0 0 20px;line-height:1.8;color:#2E3528;font-size:16px;font-family:Georgia,'Times New Roman',serif;">${lines}</p>`
}

function ctaButton(url: string, label: string) {
  return `
    <p style="margin:0 0 10px;text-align:center;">
      <a href="${url}" style="display:inline-block;background:#4A1F3D;color:#FAF4F0;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;padding:18px 48px;">${label}</a>
    </p>
    <p style="margin:0 0 24px;text-align:center;font-family:Arial,sans-serif;font-size:11px;color:#C49AAA;">
      Button not working? <a href="${url}" style="color:#A86B85;text-decoration:underline;">Tap here instead</a>
    </p>`
}

function buildEmailHtml(body: string, ctaUrl?: string, ctaLabel = 'Open your Inner Circle'): string {
  const processedBody = body
    .split(/\n\n+/)
    .map(para => {
      const trimmed = para.trim()
      if (trimmed === '{{CTA}}') return ctaUrl ? ctaButton(ctaUrl, ctaLabel) : ''
      return toParagraph(trimmed)
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <style>
    @media screen and (max-width:600px) {
      .ec { width:100% !important; }
      .eb { padding:32px 20px 24px !important; }
      .eh { padding:24px 20px !important; }
      .es { padding:24px 20px 36px !important; }
      .ef { padding:16px 20px !important; }
      .ed { padding:0 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#FAF4F0;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FAF4F0">
    <tr>
      <td align="center">

        <table class="ec" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td class="eh" bgcolor="#4A1F3D" style="padding:32px;text-align:center;">
              <img
                src="https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/brand/inner-circle-landscape.svg"
                alt="4Ever Inner Circle"
                width="200"
                style="display:block;margin:0 auto;max-width:100%;height:auto;"
              />
            </td>
          </tr>

          <!-- Hairline accent -->
          <tr>
            <td bgcolor="#A86B85" style="height:2px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="eb" bgcolor="#FAF4F0" style="padding:44px 40px 32px;">
              ${processedBody}
            </td>
          </tr>

          <!-- Signature divider -->
          <tr>
            <td class="ed" bgcolor="#FAF4F0" style="padding:0 40px;">
              <div style="border-top:1px solid #E8DDD8;"></div>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td class="es" bgcolor="#FAF4F0" style="padding:28px 40px 44px;">
              <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:13px;font-style:italic;color:#A86B85;">with love,</p>
              <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-style:italic;font-weight:400;color:#4A1F3D;line-height:1.1;">Annette x</p>
              <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-size:11px;color:#A86B85;letter-spacing:0.12em;text-transform:uppercase;">4Ever Photos</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;"><a href="mailto:studio@4ever.photos" style="color:#C49AAA;text-decoration:none;">studio@4ever.photos</a></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="ef" bgcolor="#4A1F3D" style="padding:20px 40px;text-align:center;">
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

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/resend'

const CATEGORY_LABELS: Record<string, string> = {
  hair: 'Hair',
  makeup: 'Make Up',
  flowers: 'Flowers',
  dress: 'Dress',
  shoes: 'Shoes',
  bridesmaids: 'Bridesmaids',
  groomswear: 'Groomswear',
  flowergirls: 'Flower Girls',
  pageboys: 'Page Boys',
  mob: 'MOB',
  venue: 'Venue',
  cars: 'Ceremony Cars',
  cakes: 'Cakes',
  photos: 'Photos',
  details: 'Details',
  other: 'Other',
}

export async function POST(request: Request) {
  const { coupleId, category, personIds, notifyWhen, coupleName, weddingDate } = await request.json()

  if (!coupleId || !category || !Array.isArray(personIds)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Remove any existing shares for this couple + category
  await supabase.from('mood_board_shares')
    .delete()
    .eq('couple_id', coupleId)
    .eq('category', category)

  if (personIds.length === 0) {
    return NextResponse.json({ success: true })
  }

  // Insert fresh shares, each with a unique view token
  const rows = personIds.map((personId: string) => ({
    couple_id: coupleId,
    category,
    person_id: personId,
    notify_when: notifyWhen ?? 'now',
    share_token: crypto.randomUUID(),
  }))

  const { data: inserted, error } = await supabase
    .from('mood_board_shares')
    .insert(rows)
    .select('share_token, notify_when, person_id')

  if (error || !inserted) {
    return NextResponse.json({ error: 'Failed to save shares' }, { status: 500 })
  }

  // If notify now, send emails straight away
  if (notifyWhen === 'now') {
    const catLabel = CATEGORY_LABELS[category] ?? category
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

    const weddingDateFormatted = weddingDate
      ? new Date(weddingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : null

    for (const share of inserted) {
      const { data: person } = await supabase
        .from('people')
        .select('name, email')
        .eq('id', share.person_id)
        .single()

      if (!person?.email) continue

      const viewUrl = `${siteUrl}/share/${share.share_token}`
      const datePhrase = weddingDateFormatted ? `, who is getting married on ${weddingDateFormatted},` : ''

      await sendEmail({
        to: person.email,
        subject: `${coupleName} has shared their ${catLabel} inspiration with you`,
        body: `Hi ${person.name},\n\n${coupleName}${datePhrase} has shared their ${catLabel} inspiration folder with you on 4Ever Inner Circle.\n\nShe'd love for you to see the ideas she is gathering. You can view it privately using the link below, any time.\n\n{{CTA}}\n\nThis is a private link just for you.`,
        ctaUrl: viewUrl,
        ctaLabel: `View ${catLabel} folder`,
      })

      await supabase.from('mood_board_shares')
        .update({ notified_at: new Date().toISOString() })
        .eq('share_token', share.share_token)
    }
  }

  return NextResponse.json({ success: true })
}

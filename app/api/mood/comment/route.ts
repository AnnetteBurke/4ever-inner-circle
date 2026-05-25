import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/resend'

const CATEGORY_LABELS: Record<string, string> = {
  hair: 'Hair', makeup: 'Make Up', flowers: 'Flowers', dress: 'Dress',
  shoes: 'Shoes', bridesmaids: 'Bridesmaids', groomswear: 'Groomswear',
  flowergirls: 'Flower Girls', pageboys: 'Page Boys', mob: 'MOB',
  venue: 'Venue', cars: 'Ceremony Cars', cakes: 'Cakes',
  photos: 'Photos', details: 'Details', other: 'Other',
}

export async function POST(request: Request) {
  const { shareToken, authorName, message, notifyAll } = await request.json()

  if (!shareToken || !authorName?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: share } = await supabase
    .from('mood_board_shares')
    .select('couple_id, category')
    .eq('share_token', shareToken)
    .single()

  if (!share) {
    return NextResponse.json({ error: 'Invalid share token' }, { status: 404 })
  }

  const { error: insertError } = await supabase
    .from('mood_board_comments')
    .insert({ share_token: shareToken, author_name: authorName.trim(), message: message.trim() })

  if (insertError) {
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 })
  }

  const catLabel = CATEGORY_LABELS[share.category] ?? share.category
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const { data: couple } = await supabase
    .from('couples')
    .select('bride_name, user_id')
    .eq('id', share.couple_id)
    .single()

  if (notifyAll) {
    // Bride is sending — email everyone in the share group for this category
    const { data: allShares } = await supabase
      .from('mood_board_shares')
      .select('share_token, person_id')
      .eq('couple_id', share.couple_id)
      .eq('category', share.category)

    for (const s of allShares ?? []) {
      const { data: person } = await supabase
        .from('people')
        .select('name, email')
        .eq('id', s.person_id)
        .single()

      if (!person?.email) continue

      await sendEmail({
        to: person.email,
        subject: `${couple?.bride_name ?? 'The bride'} has left a message on the ${catLabel} folder`,
        body: `Hi ${person.name},\n\n${couple?.bride_name ?? 'The bride'} has left a message in the ${catLabel} inspiration folder:\n\n"${message.trim()}"\n\nClick below to view the conversation and reply:\n\n{{CTA}}`,
        ctaUrl: `${siteUrl}/share/${s.share_token}`,
        ctaLabel: 'View and reply',
      })
    }
  } else {
    // Supplier or guest is sending — email the bride only
    if (couple?.user_id) {
      const { data: { user: brideUser } } = await supabase.auth.admin.getUserById(couple.user_id)
      if (brideUser?.email) {
        await sendEmail({
          to: brideUser.email,
          subject: `${authorName} has left a message on your ${catLabel} folder`,
          body: `Hi ${couple.bride_name ?? 'lovely'},\n\n${authorName} has left you a message on your ${catLabel} inspiration folder:\n\n"${message.trim()}"\n\nClick below to view the conversation and reply:\n\n{{CTA}}`,
          ctaUrl: `${siteUrl}/share/${shareToken}`,
          ctaLabel: 'View and reply',
        })
      }
    }
  }

  return NextResponse.json({ success: true })
}

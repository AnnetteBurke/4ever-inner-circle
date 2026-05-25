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
  const { shareToken, authorName, message } = await request.json()

  if (!shareToken || !authorName?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: share } = await supabase
    .from('mood_board_shares')
    .select('couple_id, category, person_id')
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
  const viewUrl = `${siteUrl}/share/${shareToken}`

  const [coupleRes, personRes] = await Promise.all([
    supabase.from('couples').select('bride_name, user_id').eq('id', share.couple_id).single(),
    supabase.from('people').select('name, email').eq('id', share.person_id).single(),
  ])

  const couple = coupleRes.data
  const supplier = personRes.data

  // If the commenter is the supplier, email the bride. If it's anyone else (the bride), email the supplier.
  const isSupplier = authorName.trim() === supplier?.name

  if (isSupplier && couple?.user_id) {
    const { data: { user: brideUser } } = await supabase.auth.admin.getUserById(couple.user_id)
    if (brideUser?.email) {
      await sendEmail({
        to: brideUser.email,
        subject: `${authorName} has left a message on your ${catLabel} folder`,
        body: `Hi ${couple.bride_name ?? 'lovely'},\n\n${authorName} has seen your ${catLabel} inspiration and left you a message:\n\n"${message.trim()}"\n\nClick below to view the conversation and reply:\n\n{{CTA}}`,
        ctaUrl: viewUrl,
        ctaLabel: 'View and reply',
      })
    }
  } else if (!isSupplier && supplier?.email) {
    await sendEmail({
      to: supplier.email,
      subject: `${couple?.bride_name ?? 'The bride'} has replied on the ${catLabel} folder`,
      body: `Hi ${supplier.name},\n\n${couple?.bride_name ?? 'The bride'} has replied to your message on the ${catLabel} inspiration folder:\n\n"${message.trim()}"\n\nClick below to view the conversation and reply:\n\n{{CTA}}`,
      ctaUrl: viewUrl,
      ctaLabel: 'View and reply',
    })
  }

  return NextResponse.json({ success: true })
}

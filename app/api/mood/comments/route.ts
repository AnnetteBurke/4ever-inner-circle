import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const supabase = createAdminClient()

  const { data: share } = await supabase
    .from('mood_board_shares')
    .select('couple_id, category')
    .eq('share_token', token)
    .single()

  if (!share) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })

  const { data: allShares } = await supabase
    .from('mood_board_shares')
    .select('share_token')
    .eq('couple_id', share.couple_id)
    .eq('category', share.category)

  const allTokens = (allShares ?? []).map(s => s.share_token)

  const { data: comments } = await supabase
    .from('mood_board_comments')
    .select('id, author_name, message, created_at')
    .in('share_token', allTokens)
    .order('created_at', { ascending: true })

  return NextResponse.json(comments ?? [], {
    headers: { 'Cache-Control': 'no-store' },
  })
}

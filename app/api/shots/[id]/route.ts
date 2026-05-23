import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: couple } = await supabase.from('couples').select('id').eq('user_id', user.id).single()
  if (!couple) return NextResponse.json({ error: 'No couple record' }, { status: 404 })

  const { error } = await supabase
    .from('shot_requests')
    .delete()
    .eq('id', params.id)
    .eq('couple_id', couple.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

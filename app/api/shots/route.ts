import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: couple } = await supabase.from('couples').select('id').eq('user_id', user.id).single()
  if (!couple) return NextResponse.json({ error: 'No couple record' }, { status: 404 })

  const { data, error } = await supabase
    .from('shot_requests')
    .select('*')
    .eq('couple_id', couple.id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: couple } = await supabase.from('couples').select('id').eq('user_id', user.id).single()
  if (!couple) return NextResponse.json({ error: 'No couple record' }, { status: 404 })

  const body = await request.json()
  const { label, people, notes } = body

  if (!label) return NextResponse.json({ error: 'Shot name is required' }, { status: 400 })

  const { data, error } = await supabase.from('shot_requests').insert({
    couple_id: couple.id,
    label,
    people: people || null,
    notes: notes || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

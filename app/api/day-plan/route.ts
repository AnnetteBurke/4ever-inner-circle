import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: couple } = await supabase.from('couples').select('id').eq('user_id', user.id).single()
  if (!couple) return NextResponse.json({ error: 'No couple record' }, { status: 404 })

  const { data, error } = await supabase
    .from('day_plan')
    .select('*')
    .eq('couple_id', couple.id)
    .single()

  if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? null)
}

export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: couple } = await supabase.from('couples').select('id').eq('user_id', user.id).single()
  if (!couple) return NextResponse.json({ error: 'No couple record' }, { status: 404 })

  const body = await request.json()

  const { data, error } = await supabase
    .from('day_plan')
    .upsert({ ...body, couple_id: couple.id, updated_at: new Date().toISOString() }, { onConflict: 'couple_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

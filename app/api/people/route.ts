import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { scheduleMessagesForPerson } from '@/lib/messages/schedule'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: couple } = await supabase.from('couples').select('id').eq('user_id', user.id).single()
  if (!couple) return NextResponse.json({ error: 'No couple record' }, { status: 404 })

  const { data, error } = await supabase
    .from('people')
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
  const { name, role, phone, email, notes, is_family, side, family_relationship, child_name, in_family_photos } = body

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const { data, error } = await supabase.from('people').insert({
    couple_id: couple.id,
    name,
    role: role || null,
    phone: phone || null,
    email: email || null,
    notes: notes || null,
    is_family: is_family || false,
    side: side || null,
    family_relationship: family_relationship || null,
    child_name: child_name || null,
    in_family_photos: in_family_photos || false,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Schedule messages for this person based on their role and the wedding date
  if (data && data.role) {
    const adminSupabase = createAdminClient()
    const { data: coupleData } = await adminSupabase
      .from('couples')
      .select('id, bride_name, groom_name, wedding_date, venue_name, venue_address, ceremony_name, ceremony_address')
      .eq('id', couple.id)
      .single()
    if (coupleData) {
      scheduleMessagesForPerson(data, coupleData).catch(() => {})
    }
  }

  return NextResponse.json(data)
}

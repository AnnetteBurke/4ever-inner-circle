import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()

  const body = await request.json()

  const allowedFields = [
    'bride_name',
    'groom_name',
    'wedding_date',
    'ceremony_time',
    'venue_name',
    'venue_address',
    'ceremony_name',
    'ceremony_address',
    'bride_mobile',
    'groom_mobile',
    'groom_email',
    'bride_prep_address',
    'groom_prep_address',
    'second_photographer_email',
  ]

  const update: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) update[field] = body[field]
  }

  const { error } = await supabase
    .from('couples')
    .update(update)
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

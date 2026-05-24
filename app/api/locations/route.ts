import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('couples')
    .select('ceremony_name, ceremony_address, bride_prep_address, groom_prep_address')
    .not('ceremony_name', 'is', null)
    .order('ceremony_name')

  const seen = new Set<string>()
  const ceremony = (data ?? [])
    .filter(r => r.ceremony_name && !seen.has(r.ceremony_name) && seen.add(r.ceremony_name))
    .map(r => ({ name: r.ceremony_name!, address: r.ceremony_address ?? '' }))

  // Collect all prep addresses (bride and groom) as a deduplicated list
  const prepSeen = new Set<string>()
  const prep: string[] = []
  for (const r of data ?? []) {
    if (r.bride_prep_address && !prepSeen.has(r.bride_prep_address)) {
      prepSeen.add(r.bride_prep_address)
      prep.push(r.bride_prep_address)
    }
    if (r.groom_prep_address && !prepSeen.has(r.groom_prep_address)) {
      prepSeen.add(r.groom_prep_address)
      prep.push(r.groom_prep_address)
    }
  }

  return NextResponse.json({ ceremony, prep })
}

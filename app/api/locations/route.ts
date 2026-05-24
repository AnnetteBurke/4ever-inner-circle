import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('couples')
      .select('ceremony_name, ceremony_address')
      .not('ceremony_name', 'is', null)
      .order('ceremony_name')

    if (error) {
      return NextResponse.json({ ceremony: [], prep: [], error: error.message })
    }

    const seen = new Set<string>()
    const ceremony = (data ?? [])
      .filter(r => r.ceremony_name && !seen.has(r.ceremony_name) && seen.add(r.ceremony_name))
      .map(r => ({ name: r.ceremony_name!, address: r.ceremony_address ?? '' }))

    // Fetch prep addresses separately to avoid schema cache issues
    const { data: prepData } = await supabase
      .from('couples')
      .select('bride_prep_address, groom_prep_address')

    const prepSeen = new Set<string>()
    const prep: string[] = []
    for (const r of prepData ?? []) {
      if (r.bride_prep_address && !prepSeen.has(r.bride_prep_address)) {
        prepSeen.add(r.bride_prep_address); prep.push(r.bride_prep_address)
      }
      if (r.groom_prep_address && !prepSeen.has(r.groom_prep_address)) {
        prepSeen.add(r.groom_prep_address); prep.push(r.groom_prep_address)
      }
    }

    return NextResponse.json({ ceremony, prep })
  } catch (e) {
    return NextResponse.json({ ceremony: [], prep: [], error: String(e) })
  }
}

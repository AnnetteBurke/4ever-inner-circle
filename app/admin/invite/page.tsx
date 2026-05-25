import { createAdminClient } from '@/lib/supabase'
import InviteForm from './InviteForm'

export const dynamic = 'force-dynamic'

export default async function InvitePage() {
  const supabase = createAdminClient()

  const { data: ceremonyData } = await supabase
    .from('couples')
    .select('ceremony_name, ceremony_address')
    .not('ceremony_name', 'is', null)
    .order('ceremony_name')

  const seen = new Set<string>()
  const ceremonyLocations = (ceremonyData ?? [])
    .filter(r => r.ceremony_name && !seen.has(r.ceremony_name) && seen.add(r.ceremony_name))
    .map(r => ({ name: r.ceremony_name as string, address: (r.ceremony_address ?? '') as string }))

  const { data: prepData } = await supabase
    .from('couples')
    .select('bride_prep_address, groom_prep_address')

  const prepSeen = new Set<string>()
  const prepLocations: string[] = []
  for (const r of prepData ?? []) {
    if (r.bride_prep_address && !prepSeen.has(r.bride_prep_address)) {
      prepSeen.add(r.bride_prep_address)
      prepLocations.push(r.bride_prep_address)
    }
    if (r.groom_prep_address && !prepSeen.has(r.groom_prep_address)) {
      prepSeen.add(r.groom_prep_address)
      prepLocations.push(r.groom_prep_address)
    }
  }

  console.log('[InvitePage] ceremonyLocations:', JSON.stringify(ceremonyLocations))
  console.log('[InvitePage] prepLocations:', JSON.stringify(prepLocations))

  return <InviteForm ceremonyLocations={ceremonyLocations} prepLocations={prepLocations} />
}

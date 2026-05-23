import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import BriefView from '@/app/home/brief/BriefView'

export default async function AdminBriefPage({ params }: { params: { coupleId: string } }) {
  const supabase = createAdminClient()

  const [{ data: couple }, { data: people }, { data: shots }, { data: plan }] = await Promise.all([
    supabase
      .from('couples')
      .select('id, bride_name, groom_name, partner_1_gender, partner_2_gender, wedding_date, venue_name, venue_address, ceremony_name, ceremony_address')
      .eq('id', params.coupleId)
      .single(),
    supabase.from('people').select('*').eq('couple_id', params.coupleId).order('created_at', { ascending: true }),
    supabase.from('shot_requests').select('*').eq('couple_id', params.coupleId).order('created_at', { ascending: true }),
    supabase.from('day_plan').select('*').eq('couple_id', params.coupleId).single(),
  ])

  if (!couple) notFound()

  return (
    <BriefView
      couple={couple}
      people={people ?? []}
      shots={shots ?? []}
      plan={plan ?? null}
      backHref="/admin"
      backLabel="All couples"
    />
  )
}

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import ShotsClient from './ShotsClient'

export default async function ShotsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: couple } = await supabase
    .from('couples')
    .select('id, bride_name, groom_name, partner_1_gender, partner_2_gender')
    .eq('user_id', user.id)
    .single()
  if (!couple) redirect('/login')

  const [{ data: shots }, { data: people }] = await Promise.all([
    supabase
      .from('shot_requests')
      .select('*')
      .eq('couple_id', couple.id)
      .order('created_at', { ascending: true }),
    supabase
      .from('people')
      .select('id, name, role, family_relationship, side, in_family_photos, is_family')
      .eq('couple_id', couple.id)
      .order('created_at', { ascending: true }),
  ])

  return (
    <ShotsClient
      brideName={couple.bride_name}
      groomName={couple.groom_name}
      partner1Gender={couple.partner_1_gender ?? 'woman'}
      partner2Gender={couple.partner_2_gender ?? 'man'}
      initialShots={shots ?? []}
      people={people ?? []}
    />
  )
}

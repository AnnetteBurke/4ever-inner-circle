import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import BriefView from './BriefView'

export default async function BriefPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: couple } = await supabase
    .from('couples')
    .select('id, bride_name, groom_name, partner_1_gender, partner_2_gender, wedding_date, venue_name, venue_address, ceremony_name, ceremony_address')
    .eq('user_id', user.id)
    .single()
  if (!couple) redirect('/login')

  const [{ data: people }, { data: shots }, { data: plan }] = await Promise.all([
    supabase.from('people').select('*').eq('couple_id', couple.id).order('created_at', { ascending: true }),
    supabase.from('shot_requests').select('*').eq('couple_id', couple.id).order('created_at', { ascending: true }),
    supabase.from('day_plan').select('*').eq('couple_id', couple.id).single(),
  ])

  return (
    <BriefView
      couple={couple}
      people={people ?? []}
      shots={shots ?? []}
      plan={plan ?? null}
      backHref="/home"
      backLabel="Inner Circle"
    />
  )
}

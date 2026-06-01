import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getSunlightInfo } from '@/lib/sunlight'
import DayPlanClient from './DayPlanClient'

export default async function DayPlanPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: couple } = await supabase
    .from('couples')
    .select('id, bride_name, groom_name, partner_1_gender, partner_2_gender, second_photographer_email, wedding_date')
    .eq('user_id', user.id)
    .single()
  if (!couple) redirect('/login')

  const sunlight = couple.wedding_date ? getSunlightInfo(couple.wedding_date) : null

  const [{ data: plan }, { data: people }] = await Promise.all([
    supabase.from('day_plan').select('*').eq('couple_id', couple.id).single(),
    supabase.from('people').select('id, name, role, phone, email').eq('couple_id', couple.id).order('created_at', { ascending: true }),
  ])

  const photographerCount: 1 | 2 = couple.second_photographer_email ? 2 : 1

  return (
    <DayPlanClient
      brideName={couple.bride_name}
      groomName={couple.groom_name}
      partner1Gender={couple.partner_1_gender ?? 'woman'}
      partner2Gender={couple.partner_2_gender ?? 'man'}
      photographerCount={photographerCount}
      initialPlan={plan ?? null}
      people={people ?? []}
      sunlight={sunlight}
    />
  )
}

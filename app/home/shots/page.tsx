import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import ShotsClient from './ShotsClient'

export default async function ShotsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: couple } = await supabase
    .from('couples')
    .select('id, bride_name, groom_name')
    .eq('user_id', user.id)
    .single()
  if (!couple) redirect('/login')

  const { data: shots } = await supabase
    .from('shot_requests')
    .select('*')
    .eq('couple_id', couple.id)
    .order('created_at', { ascending: true })

  return (
    <ShotsClient
      brideName={couple.bride_name}
      groomName={couple.groom_name}
      initialShots={shots ?? []}
    />
  )
}

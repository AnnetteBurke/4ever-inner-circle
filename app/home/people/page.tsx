import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import PeopleClient from './PeopleClient'

export default async function PeoplePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: couple } = await supabase
    .from('couples')
    .select('id, bride_name, groom_name')
    .eq('user_id', user.id)
    .single()

  if (!couple) redirect('/login')

  const { data: people } = await supabase
    .from('people')
    .select('*')
    .eq('couple_id', couple.id)
    .order('created_at', { ascending: true })

  return (
    <PeopleClient
      brideName={couple.bride_name}
      groomName={couple.groom_name}
      initialPeople={people ?? []}
    />
  )
}

import { createAdminClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import EditCoupleForm from './EditCoupleForm'

export default async function EditCouplePage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()

  const { data: couple } = await supabase
    .from('couples')
    .select('id, bride_name, groom_name, wedding_date, venue_name, venue_address, ceremony_name, ceremony_address, bride_mobile, groom_mobile, groom_email, ceremony_time, bride_prep_address, groom_prep_address, second_photographer_email')
    .eq('id', params.id)
    .single()

  if (!couple) notFound()

  return (
    <main className="min-h-screen bg-cream py-16">
      <div className="max-w-2xl mx-auto px-8">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-6">
          <a href="/admin" className="hover:text-ink transition-colors">Admin</a>
          <span className="mx-2 text-whisper">/</span>
          Edit couple
        </div>
        <h1 className="text-4xl font-light text-ink mb-2">
          {couple.bride_name} &amp; {couple.groom_name}
        </h1>
        <p className="text-base text-whisper mb-12">
          Update their details. Changes save immediately.
        </p>
        <EditCoupleForm couple={couple} />
      </div>
    </main>
  )
}

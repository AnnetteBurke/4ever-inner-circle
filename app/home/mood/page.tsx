import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import MoodBoardClient from './MoodBoardClient'

export default async function MoodBoardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: couple } = await supabase
    .from('couples')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!couple) redirect('/home')

  const { data: images } = await supabase
    .from('mood_board_images')
    .select('id, url, caption, category, storage_path')
    .eq('couple_id', couple.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-cream">

      {/* Header */}
      <div className="bg-plum text-cream px-8 md:px-16 pt-14 pb-16">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/home"
            className="text-[11px] tracking-label uppercase text-mauve-soft hover:text-cream transition-colors mb-8 block"
          >
            ← Back
          </Link>
          <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">Your vision</div>
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-4 text-cream">
            Mood Board
          </h1>
          <p className="text-cream/70 text-base leading-relaxed max-w-lg">
            Save everything you love. Hair, flowers, venue details, dress moments, table styling.
            Private, organised, and shared only with us.
          </p>
        </div>
      </div>

      {/* Board */}
      <div className="max-w-3xl mx-auto px-8 md:px-16 py-14">
        <MoodBoardClient
          coupleId={couple.id}
          initialImages={images ?? []}
        />
      </div>

    </main>
  )
}

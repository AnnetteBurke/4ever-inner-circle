import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function MoodBoardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-cream">

      {/* Header */}
      <div className="bg-plum text-cream px-8 md:px-16 pt-14 pb-16">
        <div className="max-w-2xl mx-auto">
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
            Your personal visual collection. Hair, florals, dress details, venue styling, table settings.
            Everything that makes up the feeling of your day, in one private place.
          </p>
        </div>
      </div>

      {/* Coming soon */}
      <div className="max-w-2xl mx-auto px-8 md:px-16 py-20 text-center">

        {/* Placeholder grid suggestion */}
        <div className="grid grid-cols-3 gap-2 mb-12 opacity-20 pointer-events-none select-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square bg-blush-deep rounded-none" />
          ))}
        </div>

        <div className="text-[11px] tracking-label uppercase text-mauve mb-4">Coming soon</div>
        <h2 className="text-2xl font-light text-ink mb-4">Your mood board is being built</h2>
        <p className="text-sm text-whisper leading-relaxed max-w-md mx-auto mb-8">
          Save images of everything you love. Hair inspiration, florals, venues, table scapes,
          dress details. Pinned privately, shared only with us. Nothing public, nothing lost.
        </p>

        <p className="text-xs text-whisper/60 italic">
          In the meantime, share your Pinterest or Instagram boards with Annette directly.
        </p>
      </div>

    </main>
  )
}

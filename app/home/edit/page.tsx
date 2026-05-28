import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function TheEditPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-cream flex flex-col">

      {/* Date banner */}
      <div className="bg-plum text-cream px-8 md:px-16 pt-14 pb-20 flex-1 flex flex-col justify-between min-h-[65vh]">
        <div className="max-w-2xl mx-auto w-full">
          <Link
            href="/home"
            className="text-[11px] tracking-label uppercase text-mauve-soft hover:text-cream transition-colors mb-16 block"
          >
            ← Back to your Inner Circle
          </Link>

          <div className="mb-12">
            <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-4">Opening</div>
            <div className="font-serif italic text-cream/25 text-7xl md:text-9xl leading-none mb-2">October</div>
            <div className="font-serif text-cream text-7xl md:text-9xl leading-none">2026</div>
          </div>

          <div className="border-t border-cream/10 pt-10">
            <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">Wedding shop</div>
            <h1 className="text-4xl md:text-5xl font-light text-cream mb-5">The Edit</h1>
            <p className="text-cream/70 text-base leading-relaxed max-w-lg">
              After years of photographing weddings, Annette knows exactly what makes a difference.
              The Edit is a hand-picked collection of the things she genuinely loves and recommends.
              Albums, prints, frames and the details that make your photographs last a lifetime.
            </p>
          </div>
        </div>
      </div>

      {/* What's coming */}
      <div className="max-w-2xl mx-auto w-full px-8 md:px-16 py-14 border-b border-hairline">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-8">What is on its way</div>
        <div className="space-y-6">
          {[
            { title: 'Fine-art albums', desc: 'Handcrafted, archival quality. The kind your grandchildren will open.' },
            { title: 'Prints and frames', desc: 'Gallery-quality prints in sizes and finishes that suit any home.' },
            { title: 'Wedding day accessories', desc: 'The details Annette keeps recommending couple after couple.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-hairline flex items-center justify-center mt-0.5">
                <span className="font-serif italic text-whisper text-sm">{i + 1}</span>
              </div>
              <div>
                <p className="text-base font-light text-ink mb-1">{item.title}</p>
                <p className="text-sm text-whisper leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-8 md:px-16 py-12 pb-16">
        <p className="text-sm text-whisper leading-relaxed">
          The Edit will open in your Inner Circle in October 2026.
          Everything Annette recommends, right here, ready for you.
        </p>
      </div>

    </main>
  )
}

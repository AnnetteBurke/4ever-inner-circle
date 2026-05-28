import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function SharePage() {
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
            <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">Guest album</div>
            <h1 className="text-4xl md:text-5xl font-light text-cream mb-5">Your Photos</h1>
            <p className="text-cream/70 text-base leading-relaxed max-w-lg">
              After the day, one private place for every photograph. Yours, your family, your guests.
              No apps to download, no scattered links. Just your wedding, all in one beautiful album,
              shared only with the people you choose.
            </p>
          </div>
        </div>
      </div>

      {/* What's coming */}
      <div className="max-w-2xl mx-auto w-full px-8 md:px-16 py-14 border-b border-hairline">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-8">What you will be able to do</div>
        <div className="space-y-6">
          {[
            { title: 'Upload from anyone', desc: 'You and your guests can all add photos. Everything in one place, not scattered across WhatsApp groups.' },
            { title: 'Private by default', desc: 'Only the people you invite can see your album. No public links, no strangers.' },
            { title: 'Download anything', desc: 'Every photo is yours to keep, in full resolution, forever.' },
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
          This will be ready and waiting in your Inner Circle by October 2026.
          You do not need to do anything — it will appear here automatically.
        </p>
      </div>

    </main>
  )
}

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function CalmCornerPage() {
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
            <div className="font-serif italic text-cream/25 text-7xl md:text-9xl leading-none mb-2">August</div>
            <div className="font-serif text-cream text-7xl md:text-9xl leading-none">2026</div>
          </div>

          <div className="border-t border-cream/10 pt-10">
            <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">The Bodytap Method</div>
            <h1 className="text-4xl md:text-5xl font-light text-cream mb-5">Calm Corner</h1>
            <p className="text-cream/70 text-base leading-relaxed max-w-lg">
              We are recording your five tapping sessions with Annette right now. Designed for the nerves,
              the 3am thoughts, the morning of your wedding and everything in between. They will be here,
              waiting for you, when you need them most.
            </p>
          </div>
        </div>
      </div>

      {/* What's coming */}
      <div className="max-w-2xl mx-auto w-full px-8 md:px-16 py-14">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-8">What is coming for you</div>
        <div className="space-y-px border border-hairline">
          {[
            { title: 'Before you fall asleep', desc: 'A gentle sequence to quiet the mind when wedding thoughts are keeping you awake.' },
            { title: 'Morning of the wedding', desc: 'Settle the butterflies. Feel grounded, present and ready before the day begins.' },
            { title: 'When the overwhelm hits', desc: 'For the moments when it all feels like too much. Quick, discreet, effective.' },
            { title: 'For the big emotions', desc: 'Tears, joy, nerves all at once. This one holds space for all of it.' },
            { title: 'After the day', desc: 'The wedding is over. This helps you land softly into what comes next.' },
          ].map((seq, i) => (
            <div key={i} className="flex items-start gap-6 px-8 py-6 bg-cream">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-hairline flex items-center justify-center mt-0.5">
                <span className="font-serif italic text-whisper text-sm">{i + 1}</span>
              </div>
              <div>
                <p className="text-base font-light text-ink mb-1">{seq.title}</p>
                <p className="text-sm text-whisper leading-relaxed">{seq.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature */}
      <div className="max-w-2xl mx-auto w-full px-8 md:px-16 pb-16 text-center border-t border-hairline pt-12">
        <p className="text-sm text-whisper italic leading-relaxed max-w-md mx-auto mb-4">
          &ldquo;I started Bodytap because I kept seeing brides overwhelmed on their wedding morning.
          I wanted to give you something real that actually helps.&rdquo;
        </p>
        <span className="font-signature text-2xl text-mauve">Annette</span>
      </div>

    </main>
  )
}

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const sequences = [
  {
    title: 'Before you fall asleep',
    desc: 'A gentle sequence to quiet the mind when wedding thoughts are keeping you awake.',
  },
  {
    title: 'Morning of the wedding',
    desc: 'Settle the butterflies. Feel grounded, present and ready before the day begins.',
  },
  {
    title: 'When the overwhelm hits',
    desc: 'For the moments when it all feels like too much. Quick, discreet, effective.',
  },
  {
    title: 'For the big emotions',
    desc: 'Tears, joy, nerves all at once. This one holds space for all of it.',
  },
  {
    title: 'After the day',
    desc: 'The wedding is over. This helps you land softly into what comes next.',
  },
]

export default async function CalmCornerPage() {
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
          <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">The Bodytap Method</div>
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-4 text-cream">
            Calm Corner
          </h1>
          <p className="text-cream/70 text-base leading-relaxed max-w-lg">
            Five tapping sequences, gifted to you from Annette&apos;s sister practice Bodytap.
            For the nerves, the worries, the 3am thoughts and the big day itself.
          </p>
        </div>
      </div>

      {/* What is tapping */}
      <div className="max-w-2xl mx-auto px-8 md:px-16 py-14 border-b border-hairline">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-4">What is tapping?</div>
        <p className="text-base text-charcoal leading-relaxed mb-4">
          Tapping — or Emotional Freedom Technique — is a clinically studied practice that combines
          gentle fingertip tapping on specific points of the body with focused breathing and intention.
          It works quickly, needs no equipment, and you can do it anywhere.
        </p>
        <p className="text-base text-charcoal leading-relaxed mb-6">
          Annette&apos;s sister practice, Bodytap, specialises in using it for life&apos;s biggest moments.
          Weddings, as it turns out, produce some of the most profound anxiety and joy a person can hold
          at the same time. These sequences were created with exactly that in mind.
        </p>
        <a
          href="https://bodytap.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-label uppercase text-mauve border border-mauve px-6 py-3 inline-block hover:bg-mauve hover:text-cream transition-colors"
        >
          Learn more at Bodytap →
        </a>
      </div>

      {/* The 5 coins */}
      <div className="max-w-2xl mx-auto px-8 md:px-16 py-14">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Your gifted sessions</div>
        <p className="text-sm text-whisper mb-10">
          Five sequences, yours to use whenever you need them. No time limit, no expiry.
        </p>

        <div className="space-y-px border border-hairline">
          {sequences.map((seq, i) => (
            <div
              key={i}
              className="flex items-start gap-6 px-8 py-7 bg-cream hover:bg-blush-soft transition-colors group"
            >
              {/* Coin */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full border border-mauve flex items-center justify-center mt-0.5">
                <span className="font-serif italic text-mauve text-sm">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-light text-ink mb-1 group-hover:text-plum transition-colors">
                  {seq.title}
                </p>
                <p className="text-sm text-whisper leading-relaxed">{seq.desc}</p>
              </div>
              <div className="flex-shrink-0 text-mauve/40 group-hover:text-mauve transition-colors text-lg mt-0.5">
                →
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-whisper/60 italic mt-6 text-center">
          Full sequences coming soon — we&apos;re recording them with Annette now.
        </p>
      </div>

      {/* Signature */}
      <div className="max-w-2xl mx-auto px-8 md:px-16 pb-16 text-center border-t border-hairline pt-12">
        <p className="text-sm text-whisper italic leading-relaxed max-w-md mx-auto mb-4">
          &ldquo;I started Bodytap because I kept seeing brides overwhelmed on their wedding morning.
          I wanted to give you something real that actually helps.&rdquo;
        </p>
        <span className="font-signature text-2xl text-mauve">Annette</span>
      </div>

    </main>
  )
}

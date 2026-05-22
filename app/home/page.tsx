import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Link from 'next/link'

const features = [
  {
    label: 'Your Circle',
    tag: 'Your people',
    desc: 'Add your bridal party, family and suppliers. We brief everyone at the right moment.',
    href: '/home/people',
    accent: 'text-mauve',
  },
  {
    label: 'Mood Board',
    tag: 'Your vision',
    desc: 'Your personal Pinterest, built in. Hair, flowers, venue, dress — all in one place, shared only with the right eyes.',
    href: '/home/mood',
    accent: 'text-mauve',
  },
  {
    label: 'Your Journey',
    tag: 'The timeline',
    desc: 'The full story of your day, built with your suppliers. Everyone knows where to be and when.',
    href: '/home/journey',
    accent: 'text-mauve',
  },
  {
    label: 'Calm Corner',
    tag: 'The Bodytap Method',
    desc: 'For the nerves, the worries, the butterflies and the stress. Five tapping coins, gifted with our compliments.',
    href: '/home/calm',
    accent: 'text-mauve',
  },
  {
    label: 'Gift List',
    tag: 'Photography gifts',
    desc: 'A mobile portrait studio at your venue, extra coverage, fine-art albums. Let the people who love you give to your story.',
    href: '/home/registry',
    accent: 'text-mauve',
  },
  {
    label: 'Shared Album',
    tag: 'Every moment',
    desc: 'Your professional images alongside every angle captured by your guests. One place for it all.',
    href: '/home/album',
    accent: 'text-mauve',
  },
]

function getCountdown(weddingDate: string | null): { days: number | null; label: string } {
  if (!weddingDate) return { days: null, label: '' }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const wedding = new Date(weddingDate)
  wedding.setHours(0, 0, 0, 0)
  const diff = Math.round((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return { days: 0, label: 'Today is your day' }
  if (diff < 0) return { days: Math.abs(diff), label: `days since your wedding` }
  return { days: diff, label: 'days to go' }
}

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: couple } = await supabase
    .from('couples')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!couple?.wedding_date) redirect('/home/setup')

  const { days, label } = getCountdown(couple.wedding_date)

  const weddingDateFormatted = new Date(couple.wedding_date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <main className="min-h-screen bg-cream">

      {/* Header */}
      <div className="bg-plum text-cream px-8 md:px-16 pt-16 pb-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-8">
          <div className="flex-1">
            <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-4">
              4Ever Inner Circle
            </div>
            <h1 className="text-4xl md:text-6xl font-light leading-tight mb-3 text-cream">
              {couple.bride_name} <span className="font-serif italic text-mauve-soft">&</span> {couple.groom_name}
            </h1>
            <p className="text-cream/60 text-base">{couple.venue_name} · {weddingDateFormatted}</p>
          </div>

          {days !== null && (
            <div className="flex-shrink-0 border border-cream/25 px-10 py-8 text-center min-w-[160px]">
              <div className="font-serif text-6xl md:text-8xl text-cream leading-none mb-2">{days}</div>
              <div className="font-serif italic text-base text-mauve-soft">{label}</div>
            </div>
          )}
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border border-hairline">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="bg-cream p-8 hover:bg-blush-soft transition-colors group"
            >
              <div className="text-[10px] tracking-label uppercase text-mauve mb-3">{f.tag}</div>
              <h3 className="text-2xl font-light text-ink mb-3 group-hover:text-plum transition-colors">
                {f.label}
              </h3>
              <p className="text-sm text-whisper leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-8 md:px-16 pb-16 flex justify-between items-center text-[11px] tracking-label uppercase text-whisper">
        <span>4Ever Photos · Inner Circle</span>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-whisper hover:text-mauve transition-colors">
            Sign out
          </button>
        </form>
      </div>

    </main>
  )
}

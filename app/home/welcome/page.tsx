import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Link from 'next/link'

const whatIsInside = [
  {
    label: 'Our Circle',
    desc: 'Add your bridal party, family and suppliers. We brief everyone at the right moment.',
  },
  {
    label: 'Your Timeline',
    desc: 'The full story of your day, built with your suppliers. Everyone knows where to be and when.',
  },
  {
    label: 'Mood Board',
    desc: 'Hair, flowers, venue, dress. All in one place, shared only with the right eyes.',
  },
  {
    label: 'Calm Corner',
    desc: 'For the nerves, the worries, the butterflies and the stress. Five tapping coins, gifted with our compliments.',
  },
  {
    label: 'Gift List',
    desc: 'Let the people who love you give to your story. Extra coverage, fine-art albums, a portrait studio at your venue.',
  },
  {
    label: 'Shared Album',
    desc: 'Your professional images alongside every moment captured by your guests. One place for it all.',
  },
]

export default async function WelcomePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: couple } = await supabase
    .from('couples')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!couple) redirect('/login')
  if (couple.wedding_date) redirect('/home')

  return (
    <main className="min-h-screen bg-cream">

      {/* Plum hero */}
      <div className="bg-plum text-cream px-8 md:px-16 pt-24 pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-8">
            4Ever Inner Circle
          </div>
          <h1 className="text-5xl md:text-7xl font-light leading-tight text-cream">
            {couple.bride_name}{' '}
            <span className="font-serif italic text-mauve-soft">&</span>{' '}
            {couple.groom_name}
          </h1>
          <p className="font-serif italic text-2xl text-mauve-soft mt-6">
            Your space is ready
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-2xl mx-auto px-8 pt-20 pb-12 text-center">
        <p className="text-lg text-charcoal leading-relaxed mb-5">
          This is your private Inner Circle. A place where your wedding day takes shape, where the right people are briefed at the right moment, and where every detail is held with care.
        </p>
        <p className="text-base text-whisper leading-relaxed">
          Everything you need, in one beautiful space, just for you both.
        </p>
      </div>

      {/* What's inside */}
      <div className="max-w-3xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline border border-hairline mb-16">
          {whatIsInside.map((item) => (
            <div key={item.label} className="bg-cream px-8 py-7">
              <h3 className="text-base font-light text-plum mb-2">{item.label}</h3>
              <p className="text-sm text-whisper leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/home/setup"
            className="inline-block px-14 py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors"
          >
            Open my Inner Circle
          </Link>
          <p className="text-sm text-whisper mt-5">Takes about two minutes</p>
        </div>
      </div>

    </main>
  )
}

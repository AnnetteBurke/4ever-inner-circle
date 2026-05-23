import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import Link from 'next/link'

const features = [
  {
    label: 'Your Circle',
    tag: 'Your people',
    desc: 'Add your bridal party, family and suppliers. We brief everyone at the right moment.',
    href: '/home/people',
  },
  {
    label: 'Day Plan',
    tag: 'Your day',
    desc: 'Walk us through the shape of your day. The more we know, the more we can anticipate every moment.',
    href: '/home/day-plan',
  },
  {
    label: 'Shot Requests',
    tag: 'Photography',
    desc: 'Tell us the specific group moments and people you want captured, beyond the standard family groups.',
    href: '/home/shots',
  },
  {
    label: 'Mood Board',
    tag: 'Your vision',
    desc: 'Your personal Pinterest, built in. Hair, flowers, venue, dress — all in one place, shared only with the right eyes.',
    href: '/home/mood',
  },
  {
    label: 'Calm Corner',
    tag: 'The Bodytap Method',
    desc: 'For the nerves, the worries, the butterflies and the stress. Five tapping coins, gifted with our compliments.',
    href: '/home/calm',
  },
  {
    label: 'Gift List',
    tag: 'Photography gifts',
    desc: 'A mobile portrait studio at your venue, extra coverage, fine-art albums. Let the people who love you give to your story.',
    href: '/home/registry',
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

  const { days, label } = getCountdown(couple?.wedding_date ?? null)

  const weddingDateFormatted = couple?.wedding_date
    ? new Date(couple.wedding_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  let venueImageUrl: string | null = null
  let venueImages: string[] = []
  if (couple?.venue_slug) {
    const adminClient = createAdminClient()
    const { data: files } = await adminClient.storage.from('Venues').list(couple.venue_slug, { limit: 20 })
    if (files && files.length > 0) {
      const imageFiles = files.filter(f =>
        f.id !== null && /\.(jpg|jpeg|png|webp|gif|heic|heif)$/i.test(f.name)
      )
      const urls = imageFiles.map(f => {
        const { data } = adminClient.storage.from('Venues').getPublicUrl(`${couple.venue_slug}/${f.name}`)
        return data.publicUrl
      })
      venueImageUrl = urls[0] ?? null
      venueImages = urls.slice(1)
    }
  }

  return (
    <main className="min-h-screen bg-cream">

      {/* Header */}
      <div
        className="relative text-cream px-8 md:px-16 pt-16 pb-20 overflow-hidden"
        style={venueImageUrl ? {
          backgroundImage: `url(${venueImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : { backgroundColor: '#4A1F3D' }}
      >
        {venueImageUrl && (
          <div className="absolute inset-0 bg-plum/80" />
        )}
        <div className="relative max-w-4xl mx-auto flex items-center justify-between gap-8">
          <div className="flex-1">
            <img
              src="/brand/Inner Circle Landscap.svg"
              alt="4Ever Inner Circle"
              className="h-14 md:h-20 w-auto mb-5"
            />
            <h1 className="text-4xl md:text-6xl font-light leading-tight mb-3 text-cream">
              {couple.bride_name} <span className="font-serif italic text-mauve-soft">&</span> {couple.groom_name}
            </h1>
            {(couple?.venue_name || weddingDateFormatted) && (
              <p className="text-cream/60 text-base">
                {[couple?.venue_name, weddingDateFormatted].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>

          {days !== null && (
            <div className="flex-shrink-0 border border-cream/25 px-10 py-8 text-center min-w-[160px]">
              <div className="font-serif text-6xl md:text-8xl text-cream leading-none mb-2">{days}</div>
              <div className="font-serif italic text-base text-mauve-soft">{label}</div>
            </div>
          )}
        </div>
      </div>

      {/* Venue photo strip */}
      {venueImages.length > 0 && (
        <div className="flex gap-0.5 h-56 md:h-80 overflow-hidden">
          {venueImages.slice(0, 5).map((url, i) => (
            <div key={i} className="flex-1 overflow-hidden">
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

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

      {/* Photographer's Brief link */}
      <div className="max-w-4xl mx-auto px-8 md:px-16 pb-8">
        <Link
          href="/home/brief"
          className="flex items-center justify-between border border-mauve px-8 py-6 hover:bg-mauve hover:text-cream transition-colors group"
        >
          <div>
            <div className="text-[10px] tracking-label uppercase text-mauve group-hover:text-cream/70 transition-colors mb-1">Photographer&apos;s Brief</div>
            <p className="text-base font-light text-ink group-hover:text-cream transition-colors">
              View your complete day brief — all locations, people, groups and plans in one place.
            </p>
          </div>
          <span className="text-mauve group-hover:text-cream transition-colors text-xl ml-6 flex-shrink-0">→</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-8 md:px-16 pb-16 flex justify-between items-center text-[11px] tracking-label uppercase text-whisper">
        <img src="/brand/Inner Circle.svg" alt="4Ever Inner Circle" className="h-6 w-auto opacity-40" />
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-whisper hover:text-mauve transition-colors">
            Sign out
          </button>
        </form>
      </div>

    </main>
  )
}

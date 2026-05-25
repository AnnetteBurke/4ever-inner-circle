import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import Link from 'next/link'
import DashboardCards from './DashboardCards'
import InstallNudge from '@/components/InstallNudge'

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

  let venueImageUrl: string | null = null      // desktop hero (image 00 — wide panoramic)
  let mobileVenueImageUrl: string | null = null // mobile hero (image 05 — fields shot)
  let venueImages: string[] = []               // desktop strip images
  let mobileStripImages: string[] = []         // mobile strip: 2 hand-picked images
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
      mobileVenueImageUrl = urls[5] ?? urls[urls.length - 1] ?? urls[0] ?? null
      venueImages = urls.slice(1)
      // Mobile strip: bridge shot (index 9) left, bridal shot (index 2) right
      mobileStripImages = [urls[9] ?? urls[1], urls[2] ?? urls[1]].filter(Boolean) as string[]
    }
  }

  return (
    <main className="min-h-screen bg-cream">

      {/* Header */}
      <div
        className="relative text-cream px-8 md:px-16 pt-6 md:pt-16 pb-8 md:pb-20 overflow-hidden"
        style={!venueImageUrl ? { backgroundColor: '#4A1F3D' } : undefined}
      >
        {/* Desktop hero image (image 00 — wide panoramic, perfect on desktop) */}
        {venueImageUrl && (
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${venueImageUrl})` }}
          />
        )}
        {/* Mobile hero image (image 01 — better full-screen portrait) */}
        {(mobileVenueImageUrl || venueImageUrl) && (
          <div
            className="md:hidden absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${mobileVenueImageUrl ?? venueImageUrl})` }}
          />
        )}
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
        <>
          {/* Mobile: 2 images side by side */}
          <div className="md:hidden grid grid-cols-2 gap-0.5 h-40">
            {mobileStripImages.map((url, i) => (
              <div key={i} className="overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          {/* Desktop: up to 5 images in a flex strip */}
          <div className="hidden md:flex gap-0.5 h-80 overflow-hidden">
            {venueImages.slice(0, 5).map((url, i) => (
              <div key={i} className="flex-1 overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Install nudge */}
      <div className="max-w-4xl mx-auto pt-10">
        <InstallNudge />
      </div>

      {/* Feature cards */}
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-16">
        <DashboardCards />
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

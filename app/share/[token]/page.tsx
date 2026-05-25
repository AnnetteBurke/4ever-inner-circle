import { createAdminClient } from '@/lib/supabase'

const CATEGORY_LABELS: Record<string, string> = {
  hair: 'Hair',
  makeup: 'Make Up',
  flowers: 'Flowers',
  dress: 'Dress',
  shoes: 'Shoes',
  bridesmaids: 'Bridesmaids',
  groomswear: 'Groomswear',
  flowergirls: 'Flower Girls',
  pageboys: 'Page Boys',
  mob: 'MOB',
  venue: 'Venue',
  cars: 'Ceremony Cars',
  cakes: 'Cakes',
  photos: 'Photos',
  details: 'Details',
  other: 'Other',
}

type PageProps = { params: Promise<{ token: string }> }

export default async function SharePage({ params }: PageProps) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: share } = await supabase
    .from('mood_board_shares')
    .select('couple_id, category')
    .eq('share_token', token)
    .single()

  if (!share) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-8">
        <div className="text-center max-w-sm">
          <img src="/brand/Inner Circle Landscap.svg" alt="4Ever Inner Circle" className="h-8 w-auto mx-auto mb-10 opacity-40" />
          <p className="text-sm text-whisper leading-relaxed">This link doesn't appear to be valid. It may have expired or been removed.</p>
        </div>
      </main>
    )
  }

  const [coupleRes, imagesRes] = await Promise.all([
    supabase.from('couples').select('bride_name, wedding_date').eq('id', share.couple_id).single(),
    supabase.from('mood_board_images')
      .select('id, url, caption')
      .eq('couple_id', share.couple_id)
      .eq('category', share.category)
      .order('created_at', { ascending: false }),
  ])

  const couple = coupleRes.data
  const images = imagesRes.data ?? []
  const catLabel = CATEGORY_LABELS[share.category] ?? share.category

  const weddingDateFormatted = couple?.wedding_date
    ? new Date(couple.wedding_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <main className="min-h-screen bg-cream">

      <div className="bg-plum text-cream px-8 md:px-16 pt-14 pb-16">
        <div className="max-w-3xl mx-auto">
          <img src="/brand/Inner Circle Landscap.svg" alt="4Ever Inner Circle" className="h-8 w-auto mb-10 opacity-70" />
          <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">
            {couple?.bride_name ? `${couple.bride_name}'s inspiration` : 'Shared with you'}
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-cream mb-3">{catLabel}</h1>
          {weddingDateFormatted && (
            <p className="text-cream/55 text-sm">Wedding day: {weddingDateFormatted}</p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 md:px-16 py-14">
        {images.length === 0 ? (
          <div className="border border-hairline px-8 py-16 text-center">
            <p className="text-sm text-whisper italic">No images have been added to this folder yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-whisper mb-8">
              {images.length} image{images.length === 1 ? '' : 's'} — more may be added as plans develop.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {images.map(img => (
                <div key={img.id} className="relative overflow-hidden bg-sand">
                  <img src={img.url} alt={img.caption ?? ''} className="w-full h-56 object-cover" />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-plum/70 px-3 py-2">
                      <p className="text-xs text-cream leading-snug">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-whisper mt-8 text-center italic">
              This is a private link shared with you by {couple?.bride_name ?? 'the couple'} via 4Ever Inner Circle.
            </p>
          </>
        )}
      </div>

    </main>
  )
}

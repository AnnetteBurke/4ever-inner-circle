import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const gifts = [
  {
    title: 'An extra hour of coverage',
    desc: 'More time means more moments. From the first getting-ready glances to the last dance.',
    from: 'From £250',
  },
  {
    title: 'Fine-art album',
    desc: 'A handcrafted heirloom printed on archival paper, bound in linen. Built to last generations.',
    from: 'From £650',
  },
  {
    title: 'Sunrise session',
    desc: 'The morning after the wedding. Just the two of you, golden light, no one else around.',
    from: 'From £350',
  },
  {
    title: 'Mobile portrait studio',
    desc: 'A lit, styled backdrop brought to your venue. Studio-quality portraits, on your wedding day.',
    from: 'From £450',
  },
  {
    title: 'Second photographer',
    desc: 'Two pairs of eyes. Every reaction, every angle, every moment you would otherwise miss.',
    from: 'From £400',
  },
  {
    title: 'Parent album',
    desc: 'A smaller companion album for the parents. Their copy of the day, theirs to keep.',
    from: 'From £280',
  },
]

export default async function GiftListPage() {
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
          <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">Photography gifts</div>
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-4 text-cream">
            Gift List
          </h1>
          <p className="text-cream/70 text-base leading-relaxed max-w-lg">
            Let the people who love you give something that lasts. A link your guests can visit.
            Contributions go straight toward the photography extras you actually want.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-2xl mx-auto px-8 md:px-16 py-12 border-b border-hairline">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-6">How it works</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '1', label: 'You choose', desc: 'Select the extras you would love. Add them to your list.' },
            { n: '2', label: 'Guests contribute', desc: 'Share a link. Guests give what they like, any amount.' },
            { n: '3', label: 'We make it happen', desc: 'Once funded, it is confirmed and added to your package.' },
          ].map(step => (
            <div key={step.n} className="flex gap-4 items-start">
              <div className="w-8 h-8 border border-mauve rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-serif italic text-mauve text-sm">{step.n}</span>
              </div>
              <div>
                <p className="text-sm font-light text-ink mb-1">{step.label}</p>
                <p className="text-xs text-whisper leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gift items */}
      <div className="max-w-2xl mx-auto px-8 md:px-16 py-12">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-8">What you can add</div>

        <div className="space-y-px border border-hairline mb-8">
          {gifts.map((gift, i) => (
            <div key={i} className="px-8 py-6 bg-cream flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <p className="text-base font-light text-ink mb-1">{gift.title}</p>
                <p className="text-sm text-whisper leading-relaxed">{gift.desc}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm text-mauve">{gift.from}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-hairline px-8 py-8 text-center">
          <div className="text-[11px] tracking-label uppercase text-mauve mb-3">Coming soon</div>
          <p className="text-sm text-whisper leading-relaxed max-w-sm mx-auto mb-4">
            The gift list with guest contributions and a shareable link is being built.
            For now, speak to Annette directly about any extras you would like to add.
          </p>
          <a
            href="mailto:studio@4ever.photos"
            className="text-[11px] tracking-label uppercase text-mauve border border-mauve px-6 py-3 inline-block hover:bg-mauve hover:text-cream transition-colors"
          >
            Talk to Annette
          </a>
        </div>
      </div>

    </main>
  )
}

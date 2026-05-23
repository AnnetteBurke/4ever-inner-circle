import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase'

export default async function AdminPage() {
  const supabase = createAdminClient()

  const { data: couples } = await supabase
    .from('couples')
    .select('id, bride_name, groom_name, wedding_date, venue_name')
    .order('wedding_date', { ascending: true })

  return (
    <main className="min-h-screen bg-cream py-16">
      <div className="max-w-2xl mx-auto px-8">

        <img src="/brand/Inner Circle Landscap.svg" alt="4Ever Inner Circle" className="h-10 w-auto mb-8 opacity-80" />
        <div className="text-[11px] tracking-label uppercase text-mauve mb-6">Admin</div>
        <h1 className="text-4xl font-light text-ink mb-2">Your couples</h1>
        <p className="text-base text-whisper mb-12">
          View each couple&apos;s photographer&apos;s brief, or set up a new Inner Circle.
        </p>

        {(!couples || couples.length === 0) ? (
          <div className="border border-hairline px-8 py-10 text-center mb-8">
            <p className="text-sm text-whisper italic">No couples set up yet.</p>
          </div>
        ) : (
          <div className="border border-hairline divide-y divide-hairline mb-8">
            {couples.map(c => {
              const date = c.wedding_date
                ? new Date(c.wedding_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : null
              const daysUntil = c.wedding_date
                ? Math.ceil((new Date(c.wedding_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <div key={c.id} className="px-6 py-5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-light text-ink">
                      {c.bride_name} &amp; {c.groom_name}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                      {date && <span className="text-sm text-whisper">{date}</span>}
                      {c.venue_name && <span className="text-sm text-whisper">{c.venue_name}</span>}
                      {daysUntil !== null && daysUntil > 0 && (
                        <span className="text-[11px] tracking-label uppercase text-mauve-soft">{daysUntil} days</span>
                      )}
                      {daysUntil !== null && daysUntil <= 0 && (
                        <span className="text-[11px] tracking-label uppercase text-mauve">Married</span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/admin/brief/${c.id}`}
                    className="text-[11px] tracking-label uppercase text-mauve border border-mauve px-5 py-2 hover:bg-mauve hover:text-cream transition-colors flex-shrink-0"
                  >
                    View brief
                  </Link>
                </div>
              )
            })}
          </div>
        )}

        <Link
          href="/admin/invite"
          className="inline-block text-[11px] tracking-label uppercase border border-plum text-plum px-8 py-3 hover:bg-plum hover:text-cream transition-colors"
        >
          + Set up a new couple
        </Link>

      </div>
    </main>
  )
}

import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase'
import { ROLES } from '@/content/roles'

function offsetLabel(days: number): string {
  if (days === 0) return 'Wedding day'
  const abs = Math.abs(days)
  const dir = days < 0 ? 'before' : 'after'
  if (abs % 7 === 0) {
    const w = abs / 7
    return `${w}w ${dir}`
  }
  return `${abs}d ${dir}`
}

const CHANNEL_COLOURS: Record<string, string> = {
  email: 'text-mauve border-mauve',
  sms: 'text-ink border-ink',
  whatsapp: 'text-emerald-700 border-emerald-600',
}

export default async function TemplatesPage() {
  const supabase = createAdminClient()
  const { data: templates } = await supabase
    .from('message_templates')
    .select('*')
    .order('recipient_role', { ascending: true })
    .order('send_offset_days', { ascending: true })

  const grouped: Record<string, typeof templates> = {}
  for (const t of templates ?? []) {
    if (!grouped[t.recipient_role]) grouped[t.recipient_role] = []
    grouped[t.recipient_role]!.push(t)
  }

  function roleLabel(slug: string) {
    return ROLES.find(r => r.slug === slug)?.label ?? slug
  }

  return (
    <main className="min-h-screen bg-cream py-16">
      <div className="max-w-3xl mx-auto px-8">

        <Link href="/admin" className="text-[11px] tracking-label uppercase text-whisper hover:text-ink transition-colors mb-6 block">
          ← Back to admin
        </Link>

        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Admin</div>
            <h1 className="text-4xl font-light text-ink">Message templates</h1>
            <p className="text-base text-whisper mt-2">
              Every message that goes out automatically — edit the words, timing, or channel any time.
            </p>
          </div>
          <Link
            href="/admin/templates/new"
            className="text-[11px] tracking-label uppercase border border-plum text-plum px-6 py-3 hover:bg-plum hover:text-cream transition-colors flex-shrink-0"
          >
            + New template
          </Link>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="border border-hairline px-8 py-10 text-center">
            <p className="text-sm text-whisper italic">No templates yet. Add your first one.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([role, roleTemplates]) => (
              <div key={role}>
                <h2 className="text-[11px] tracking-label uppercase text-mauve mb-3">{roleLabel(role)}</h2>
                <div className="border border-hairline divide-y divide-hairline">
                  {roleTemplates!.map(t => (
                    <Link
                      key={t.id}
                      href={`/admin/templates/${t.id}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-blush-soft transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-light ${t.active ? 'text-ink' : 'text-whisper'}`}>
                          {t.subject ?? t.body.slice(0, 60).replace(/\n/g, ' ') + '…'}
                        </p>
                        <p className="text-xs text-whisper mt-0.5">{t.template_key}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-[10px] tracking-label uppercase border px-2 py-0.5 ${CHANNEL_COLOURS[t.channel] ?? 'text-whisper border-hairline'}`}>
                          {t.channel === 'whatsapp' ? 'WhatsApp' : t.channel.toUpperCase()}
                        </span>
                        <span className="text-xs text-whisper w-20 text-right">{offsetLabel(t.send_offset_days)}</span>
                        {!t.active && (
                          <span className="text-[10px] tracking-label uppercase text-whisper/50">Paused</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}

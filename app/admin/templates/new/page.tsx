import Link from 'next/link'
import TemplateForm from '../TemplateForm'

const EMPTY = {
  template_key: '',
  recipient_role: '',
  channel: 'whatsapp' as const,
  trigger_type: 'wedding_date' as const,
  send_offset_days: -28,
  send_time: '09:30',
  subject: null,
  body: '',
  notes: null,
  active: true,
}

export default function NewTemplatePage() {
  return (
    <main className="min-h-screen bg-cream py-16">
      <div className="max-w-2xl mx-auto px-8">
        <Link href="/admin/templates" className="text-[11px] tracking-label uppercase text-whisper hover:text-ink transition-colors mb-6 block">
          ← Back to templates
        </Link>
        <div className="text-[11px] tracking-label uppercase text-mauve mb-2">New template</div>
        <h1 className="text-3xl font-light text-ink mb-10">Write a new message</h1>
        <TemplateForm initial={EMPTY} mode="new" />
      </div>
    </main>
  )
}

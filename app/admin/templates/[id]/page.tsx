import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import TemplateForm from '../TemplateForm'

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { data: template } = await supabase
    .from('message_templates')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!template) notFound()

  return (
    <main className="min-h-screen bg-cream py-16">
      <div className="max-w-2xl mx-auto px-8">
        <Link href="/admin/templates" className="text-[11px] tracking-label uppercase text-whisper hover:text-ink transition-colors mb-6 block">
          ← Back to templates
        </Link>
        <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Edit template</div>
        <h1 className="text-3xl font-light text-ink mb-2">{template.subject ?? template.template_key}</h1>
        <p className="text-sm text-whisper mb-10">{template.template_key}</p>
        <TemplateForm initial={template} mode="edit" />
      </div>
    </main>
  )
}

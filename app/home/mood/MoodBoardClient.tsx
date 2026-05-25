'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { createSupabaseBrowserClient as createClient } from '@/lib/supabase-browser'

type MoodImage = {
  id: string
  url: string
  caption: string | null
  category: string | null
  storage_path: string
}

type Person = {
  id: string
  name: string
  role: string | null
}

const CATEGORIES = [
  { value: 'hair', label: 'Hair' },
  { value: 'makeup', label: 'Make Up' },
  { value: 'flowers', label: 'Flowers' },
  { value: 'dress', label: 'Dress' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'bridesmaids', label: 'Bridesmaids' },
  { value: 'groomswear', label: 'Groomswear' },
  { value: 'flowergirls', label: 'Flower Girls' },
  { value: 'pageboys', label: 'Page Boys' },
  { value: 'mob', label: 'MOB' },
  { value: 'venue', label: 'Venue' },
  { value: 'cars', label: 'Ceremony Cars' },
  { value: 'cakes', label: 'Cakes' },
  { value: 'photos', label: 'Photos' },
  { value: 'details', label: 'Details' },
  { value: 'other', label: 'Other' },
]

const NOTIFY_OPTIONS = [
  { value: 'now', label: 'Right now' },
  { value: '1_month', label: '1 month before' },
  { value: '2_months', label: '2 months before' },
  { value: '3_months', label: '3 months before' },
  { value: '4_months', label: '4 months before' },
]

function ShareModal({
  category,
  coupleId,
  coupleName,
  weddingDate,
  onClose,
}: {
  category: string
  coupleId: string
  coupleName: string
  weddingDate: string | null
  onClose: () => void
}) {
  const [people, setPeople] = useState<Person[]>([])
  const [sharedWith, setSharedWith] = useState<string[]>([])
  const [notifyWhen, setNotifyWhen] = useState('now')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(false)

  const catLabel = CATEGORIES.find(c => c.value === category)?.label ?? category

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('people').select('id, name, role').eq('couple_id', coupleId).order('name'),
      supabase.from('mood_board_shares').select('person_id, notify_when').eq('couple_id', coupleId).eq('category', category),
    ]).then(([peopleRes, sharesRes]) => {
      setPeople(peopleRes.data ?? [])
      setSharedWith((sharesRes.data ?? []).map((s: { person_id: string }) => s.person_id))
      if (sharesRes.data?.[0]?.notify_when) setNotifyWhen(sharesRes.data[0].notify_when)
      setLoading(false)
    })
  }, [coupleId, category])

  async function save() {
    setSaving(true)
    await fetch('/api/mood/share-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coupleId, category, personIds: sharedWith, notifyWhen, coupleName, weddingDate }),
    })
    setSaving(false)
    if (notifyWhen === 'now' && sharedWith.length > 0) {
      setSent(true)
    } else {
      onClose()
    }
  }

  function toggle(personId: string) {
    setSharedWith(prev =>
      prev.includes(personId) ? prev.filter(id => id !== personId) : [...prev, personId]
    )
  }

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={onClose}>
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative bg-cream w-full max-w-md p-8 text-center" onClick={e => e.stopPropagation()}>
          <div className="text-[11px] tracking-label uppercase text-mauve mb-4">Done</div>
          <h2 className="text-2xl font-light text-ink mb-3">Link sent</h2>
          <p className="text-sm text-whisper leading-relaxed mb-8">
            {sharedWith.length === 1 ? 'They have' : 'Everyone you selected has'} received a private link to your {catLabel} folder.
          </p>
          <button
            onClick={onClose}
            className="px-8 py-3 text-[11px] tracking-label uppercase bg-plum text-cream hover:bg-plum/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-8" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/40" />
      <div className="relative bg-cream w-full max-w-md p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Share folder</div>
        <h2 className="text-2xl font-light text-ink mb-2">Who can see your {catLabel} folder?</h2>
        <p className="text-sm text-whisper mb-8 leading-relaxed">
          Tick anyone you'd like to share this section with. They'll receive a private link straight to these images.
        </p>

        {loading ? (
          <p className="text-sm text-whisper italic py-4">Loading your people...</p>
        ) : people.length === 0 ? (
          <div className="border border-hairline px-6 py-8 text-center mb-6">
            <p className="text-sm text-whisper mb-4">You haven't added anyone to your Inner Circle yet.</p>
            <a
              href="/home/people"
              className="text-[11px] tracking-label uppercase text-mauve border border-mauve px-4 py-2 hover:bg-mauve hover:text-cream transition-colors"
            >
              Add your people
            </a>
          </div>
        ) : (
          <div className="space-y-2 mb-8">
            {people.map(person => (
              <button
                key={person.id}
                onClick={() => toggle(person.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 border text-left transition-colors ${
                  sharedWith.includes(person.id)
                    ? 'border-mauve bg-blush-soft'
                    : 'border-hairline hover:border-mauve'
                }`}
              >
                <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center ${
                  sharedWith.includes(person.id) ? 'border-mauve bg-mauve' : 'border-whisper'
                }`}>
                  {sharedWith.includes(person.id) && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-ink flex-1">{person.name}</span>
                {person.role && (
                  <span className="text-[10px] tracking-label uppercase text-whisper">{person.role}</span>
                )}
              </button>
            ))}
            <a
              href="/home/people"
              className="flex items-center gap-3 px-4 py-3 border border-dashed border-mauve/40 hover:border-mauve text-sm text-mauve transition-colors"
            >
              <span className="text-lg leading-none">+</span>
              Add someone new
            </a>
          </div>
        )}

        {/* When to notify */}
        <div className="mb-8">
          <p className="text-[11px] tracking-label uppercase text-whisper mb-3">When should we send them the link?</p>
          <div className="flex flex-wrap gap-2">
            {NOTIFY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setNotifyWhen(opt.value)}
                className={`text-[11px] tracking-label uppercase px-3 py-2 border transition-colors ${
                  notifyWhen === opt.value
                    ? 'bg-plum border-plum text-cream'
                    : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {notifyWhen !== 'now' && (
            <p className="text-xs text-whisper mt-2 italic">
              The link will be sent automatically {notifyWhen.replace('_', ' ')} your wedding day.
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving || loading || sharedWith.length === 0}
            className="flex-1 px-6 py-3 text-[11px] tracking-label uppercase bg-plum text-cream hover:bg-plum/80 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : notifyWhen === 'now' ? 'Send link now' : 'Save and schedule'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 text-[11px] tracking-label uppercase text-whisper border border-hairline hover:text-ink transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function ImageCard({
  image,
  coupleId,
  onDelete,
  onUpdate,
}: {
  image: MoodImage
  coupleId: string
  onDelete: (id: string) => void
  onUpdate: (id: string, caption: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [caption, setCaption] = useState(image.caption ?? '')
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Remove this image?')) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.storage.from('mood-board').remove([image.storage_path])
    await supabase.from('mood_board_images').delete().eq('id', image.id)
    onDelete(image.id)
  }

  async function handleSaveCaption() {
    const supabase = createClient()
    await supabase.from('mood_board_images').update({ caption: caption || null }).eq('id', image.id)
    onUpdate(image.id, caption)
    setEditing(false)
  }

  return (
    <div
      className="relative group overflow-hidden bg-sand"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setEditing(false) }}
    >
      <img src={image.url} alt={image.caption ?? ''} className="w-full h-56 object-cover" />
      <div className={`absolute inset-0 bg-plum/70 flex flex-col justify-end p-4 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        {editing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Add a note..."
              className="w-full bg-cream/10 border border-cream/30 text-cream placeholder-cream/50 text-sm px-3 py-2 focus:outline-none focus:border-cream/70"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleSaveCaption() }}
            />
            <div className="flex gap-2">
              <button onClick={handleSaveCaption} className="text-[10px] tracking-label uppercase text-cream border border-cream/40 px-3 py-1 hover:bg-cream/20 transition-colors">Save</button>
              <button onClick={() => setEditing(false)} className="text-[10px] tracking-label uppercase text-cream/60 px-3 py-1">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex items-end justify-between gap-2">
            <button onClick={() => setEditing(true)} className="text-left flex-1 min-w-0">
              {image.caption
                ? <p className="text-sm text-cream leading-snug">{image.caption}</p>
                : <p className="text-sm text-cream/50 italic">Add a note...</p>
              }
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-shrink-0 text-[10px] tracking-label uppercase text-cream/60 hover:text-cream transition-colors"
            >
              {deleting ? '...' : 'Remove'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MoodBoardClient({
  coupleId,
  coupleName,
  weddingDate,
  initialImages,
  categoryShares,
}: {
  coupleId: string
  coupleName: string
  weddingDate: string | null
  initialImages: MoodImage[]
  categoryShares: Record<string, string>
}) {
  const [images, setImages] = useState<MoodImage[]>(initialImages)
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].value)
  const [uploading, setUploading] = useState(false)
  const [shareModal, setShareModal] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categoryImages = images.filter(img => img.category === activeCategory)
  const activeCatLabel = CATEGORIES.find(c => c.value === activeCategory)?.label ?? ''

  const handleFiles = useCallback(async (files: FileList) => {
    setUploading(true)
    const supabase = createClient()

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue

      const ext = file.name.split('.').pop()
      const path = `${coupleId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('mood-board')
        .upload(path, file, { contentType: file.type })

      if (uploadError) continue

      const { data: { publicUrl } } = supabase.storage.from('mood-board').getPublicUrl(path)

      const { data: record } = await supabase.from('mood_board_images').insert({
        couple_id: coupleId,
        storage_path: path,
        url: publicUrl,
        category: activeCategory,
      }).select().single()

      if (record) {
        setImages(prev => [record, ...prev])
      }
    }

    setUploading(false)
  }, [coupleId, activeCategory])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  return (
    <div>

      {/* Step 1 — Choose section */}
      <div className="mb-10">
        <p className="text-[11px] tracking-label uppercase text-mauve mb-2">Step 1</p>
        <p className="text-sm text-ink mb-5">Choose which section you want to save your images into:</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const count = images.filter(i => i.category === cat.value).length
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`text-[11px] tracking-label uppercase px-4 py-2.5 border transition-colors ${
                  activeCategory === cat.value
                    ? 'bg-plum border-plum text-cream'
                    : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
                }`}
              >
                {cat.label}
                {count > 0 && (
                  <span className="ml-1.5 opacity-60">{count}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2 — Upload */}
      <div className="mb-12">
        <p className="text-[11px] tracking-label uppercase text-mauve mb-2">Step 2</p>
        <p className="text-sm text-ink mb-4">
          Drop your <span className="font-medium">{activeCatLabel}</span> images below, or tap to choose from your phone or computer:
        </p>
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="border border-dashed border-mauve/40 p-10 text-center hover:border-mauve transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => e.target.files && handleFiles(e.target.files)}
          />
          {uploading ? (
            <p className="text-sm text-mauve italic">Uploading...</p>
          ) : (
            <>
              <p className="text-sm text-ink mb-1">Drop images here, or tap to upload</p>
              <p className="text-xs text-whisper">JPG, PNG, HEIC — as many as you like</p>
            </>
          )}
        </div>
      </div>

      {/* Section images */}
      <div className="border-t border-hairline pt-8">
        <div className="mb-8">
          <h3 className="text-base font-light text-ink mb-0.5">{activeCatLabel}</h3>
          <p className="text-xs text-whisper mb-6">
            {categoryImages.length === 0
              ? 'No images saved here yet'
              : `${categoryImages.length} image${categoryImages.length === 1 ? '' : 's'}`
            }
          </p>

          {/* Share this folder */}
          <div className="mb-5">
            <p className="text-xs text-whisper leading-relaxed mb-2">
              Give your supplier or bridal party a private link to this folder. They can see your inspiration, leave their thoughts, and you can all stay on the same page without a single email chain.
            </p>
            {categoryImages.length > 0 && (
              <button
                onClick={() => setShareModal(activeCategory)}
                className="text-[11px] tracking-label uppercase text-mauve border border-mauve px-4 py-2 hover:bg-mauve hover:text-cream transition-colors"
              >
                Share this folder
              </button>
            )}
          </div>

          {/* View conversation */}
          {categoryShares[activeCategory] && (
            <div>
              <p className="text-xs text-whisper leading-relaxed mb-2">
                Any messages between you and the people you have shared this folder with are stored here.
              </p>
              <a
                href={`/share/${categoryShares[activeCategory]}`}
                className="text-[11px] tracking-label uppercase text-ink border border-hairline px-4 py-2 hover:border-mauve hover:text-mauve transition-colors inline-block"
              >
                View conversation
              </a>
            </div>
          )}
        </div>

        {categoryImages.length === 0 ? (
          <div className="border border-hairline px-8 py-12 text-center">
            <p className="text-sm text-whisper italic">
              Nothing saved here yet. Choose your section above and drop in your first image.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {categoryImages.map(img => (
              <ImageCard
                key={img.id}
                image={img}
                coupleId={coupleId}
                onDelete={id => setImages(prev => prev.filter(i => i.id !== id))}
                onUpdate={(id, cap) => setImages(prev => prev.map(i => i.id === id ? { ...i, caption: cap } : i))}
              />
            ))}
          </div>
        )}
      </div>

      {shareModal && (
        <ShareModal
          category={shareModal}
          coupleId={coupleId}
          coupleName={coupleName}
          weddingDate={weddingDate}
          onClose={() => setShareModal(null)}
        />
      )}
    </div>
  )
}

'use client'

import { useState, useRef, useCallback } from 'react'
import { createSupabaseBrowserClient as createClient } from '@/lib/supabase-browser'

type MoodImage = {
  id: string
  url: string
  caption: string | null
  category: string | null
  storage_path: string
}

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'hair', label: 'Hair' },
  { value: 'flowers', label: 'Flowers' },
  { value: 'dress', label: 'Dress' },
  { value: 'venue', label: 'Venue' },
  { value: 'details', label: 'Details' },
  { value: 'other', label: 'Other' },
]

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
      <img
        src={image.url}
        alt={image.caption ?? ''}
        className="w-full h-56 object-cover"
      />

      {/* Hover overlay */}
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
  initialImages,
}: {
  coupleId: string
  initialImages: MoodImage[]
}) {
  const [images, setImages] = useState<MoodImage[]>(initialImages)
  const [activeCategory, setActiveCategory] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [uploadCategory, setUploadCategory] = useState('other')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory)

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

      // Insert record
      const { data: record } = await supabase.from('mood_board_images').insert({
        couple_id: coupleId,
        storage_path: path,
        url: publicUrl,
        category: uploadCategory,
      }).select().single()

      if (record) {
        setImages(prev => [record, ...prev])
      }
    }

    setUploading(false)
  }, [coupleId, uploadCategory])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  return (
    <div>
      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border border-dashed border-mauve/40 p-10 text-center mb-10 hover:border-mauve transition-colors cursor-pointer"
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
            <p className="text-sm text-ink mb-1">Drop images here, or click to upload</p>
            <p className="text-xs text-whisper">JPG, PNG, HEIC — as many as you like</p>
          </>
        )}
      </div>

      {/* Category for uploads */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <span className="text-[11px] tracking-label uppercase text-whisper">Upload into:</span>
        {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
          <button
            key={cat.value}
            onClick={() => setUploadCategory(cat.value)}
            className={`text-[11px] tracking-label uppercase px-4 py-2 border transition-colors ${
              uploadCategory === cat.value
                ? 'bg-mauve border-mauve text-cream'
                : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      {images.length > 0 && (
        <div className="flex items-center gap-3 mb-8 flex-wrap border-t border-hairline pt-6">
          <span className="text-[11px] tracking-label uppercase text-whisper">Show:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`text-[11px] tracking-label uppercase px-4 py-2 border transition-colors ${
                activeCategory === cat.value
                  ? 'bg-plum border-plum text-cream'
                  : 'border-hairline text-whisper hover:border-mauve hover:text-ink'
              }`}
            >
              {cat.label}
              {cat.value !== 'all' && (
                <span className="ml-1 opacity-50">
                  {images.filter(i => i.category === cat.value).length || ''}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="border border-hairline px-8 py-16 text-center">
          <p className="text-sm text-whisper italic">
            {images.length === 0
              ? 'Nothing saved yet. Drop in your first image above.'
              : 'No images in this category yet.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {filtered.map(img => (
            <ImageCard
              key={img.id}
              image={img}
              coupleId={coupleId}
              onDelete={id => setImages(prev => prev.filter(i => i.id !== id))}
              onUpdate={(id, caption) => setImages(prev => prev.map(i => i.id === id ? { ...i, caption } : i))}
            />
          ))}
        </div>
      )}
    </div>
  )
}

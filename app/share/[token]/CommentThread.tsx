'use client'

import { useState } from 'react'

type Comment = {
  id: string
  author_name: string
  message: string
  created_at: string
}

export default function CommentThread({
  shareToken,
  initialComments,
  supplierName,
  brideName,
}: {
  shareToken: string
  initialComments: Comment[]
  supplierName: string
  brideName: string
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  // If the supplier has already commented, the bride is likely now viewing to reply.
  // Flip the name field and heading accordingly.
  const supplierHasCommented = initialComments.some(c => c.author_name === supplierName)
  const replyingTo = supplierHasCommented ? supplierName : brideName
  const defaultName = supplierHasCommented ? '' : supplierName

  const [name, setName] = useState(defaultName)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim() || !name.trim()) return
    setSending(true)

    const res = await fetch('/api/mood/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareToken, authorName: name, message }),
    })

    if (res.ok) {
      setComments(prev => [...prev, {
        id: Date.now().toString(),
        author_name: name,
        message: message.trim(),
        created_at: new Date().toISOString(),
      }])
      setMessage('')
      setSent(true)
    }

    setSending(false)
  }

  return (
    <div className="border-t border-hairline mt-16 pt-12">
      <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Conversation</div>
      <h2 className="text-2xl font-light text-ink mb-8">
        Leave a message for {replyingTo}
      </h2>

      {/* Thread */}
      {comments.length > 0 && (
        <div className="space-y-4 mb-10">
          {comments.map(comment => (
            <div key={comment.id} className="border border-hairline px-5 py-4">
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <span className="text-sm font-medium text-ink">{comment.author_name}</span>
                <span className="text-[10px] tracking-label uppercase text-whisper flex-shrink-0">{formatTime(comment.created_at)}</span>
              </div>
              <p className="text-sm text-charcoal leading-relaxed">{comment.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      {sent ? (
        <div className="border border-hairline px-6 py-8 text-center">
          <p className="text-sm text-ink mb-1 font-light">Message sent</p>
          <p className="text-xs text-whisper">
            {replyingTo} will be notified and can reply here.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-4 text-[11px] tracking-label uppercase text-mauve hover:text-ink transition-colors"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Your name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full border border-hairline px-4 py-3 text-sm text-ink bg-transparent focus:outline-none focus:border-mauve transition-colors placeholder-whisper"
            />
          </div>
          <div>
            <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Your message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              rows={4}
              placeholder={`Write something to ${replyingTo}...`}
              className="w-full border border-hairline px-4 py-3 text-sm text-ink bg-transparent focus:outline-none focus:border-mauve transition-colors resize-none placeholder-whisper"
            />
          </div>
          <button
            type="submit"
            disabled={sending || !message.trim() || !name.trim()}
            className="px-8 py-3 text-[11px] tracking-label uppercase bg-plum text-cream hover:bg-plum/80 transition-colors disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  )
}

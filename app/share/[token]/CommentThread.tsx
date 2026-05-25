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
  sharedPeople,
  brideName,
}: {
  shareToken: string
  initialComments: Comment[]
  sharedPeople: string[]
  brideName: string
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [selectedName, setSelectedName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const isBride = selectedName === brideName
  const allOptions = [...sharedPeople, brideName]

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedName || !message.trim()) return
    setSending(true)

    const res = await fetch('/api/mood/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareToken, authorName: selectedName, message, notifyAll: isBride }),
    })

    if (res.ok) {
      setComments(prev => [...prev, {
        id: Date.now().toString(),
        author_name: selectedName,
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

      {/* Form — always at top */}
      <div className="mb-14">
        <div className="text-[11px] tracking-label uppercase text-mauve mb-2">Leave a message</div>
        <h2 className="text-2xl font-light text-ink mb-8">Add to the conversation</h2>

        {sent ? (
          <div className="border border-hairline px-6 py-8 text-center">
            <p className="text-sm text-ink mb-1 font-light">Message sent</p>
            <p className="text-xs text-whisper">
              {isBride ? 'Everyone in this group has been notified.' : `${brideName} will be notified and can reply here.`}
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
              <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Who are you?</label>
              <div className="relative">
                <select
                  value={selectedName}
                  onChange={e => setSelectedName(e.target.value)}
                  required
                  className="w-full border border-hairline px-4 py-3 text-sm text-ink bg-cream focus:outline-none focus:border-mauve transition-colors appearance-none pr-8"
                >
                  <option value="">Select your name</option>
                  {allOptions.map(name => (
                    <option key={name} value={name}>
                      {name === brideName ? `${name} — bride` : name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-whisper text-xs">▾</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] tracking-label uppercase text-whisper block mb-2">Your message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={4}
                placeholder={
                  !selectedName ? 'Select your name first...' :
                  isBride ? 'Write to everyone in this group...' :
                  `Write something to ${brideName}...`
                }
                disabled={!selectedName}
                className="w-full border border-hairline px-4 py-3 text-sm text-ink bg-transparent focus:outline-none focus:border-mauve transition-colors resize-none placeholder-whisper disabled:opacity-40"
              />
              {selectedName && (
                <p className="text-xs text-whisper mt-1.5 italic">
                  {isBride
                    ? 'Your message will be sent to everyone in this group.'
                    : `Your message will go to ${brideName}.`
                  }
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={sending || !message.trim() || !selectedName}
              className="px-8 py-3 text-[11px] tracking-label uppercase bg-plum text-cream hover:bg-plum/80 transition-colors disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}
      </div>

      {/* Thread — below the form */}
      {comments.length > 0 && (
        <div>
          <div className="text-[11px] tracking-label uppercase text-mauve mb-6">Previous messages</div>
          <div className="space-y-4">
            {comments.map(comment => (
              <div
                key={comment.id}
                className={`border px-5 py-4 ${comment.author_name === brideName ? 'border-mauve/40 bg-blush-soft' : 'border-hairline'}`}
              >
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <span className="text-sm font-medium text-ink">{comment.author_name}</span>
                  <span className="text-[10px] tracking-label uppercase text-whisper flex-shrink-0">{formatTime(comment.created_at)}</span>
                </div>
                <p className="text-sm text-charcoal leading-relaxed">{comment.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

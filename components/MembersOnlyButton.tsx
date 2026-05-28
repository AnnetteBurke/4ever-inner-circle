'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MembersOnlyButton({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-plum/60 backdrop-blur-sm" />
          <div
            className="relative bg-cream max-w-sm w-full px-8 py-10 text-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-5 text-whisper hover:text-ink transition-colors text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
            <div className="text-[10px] tracking-label uppercase text-mauve mb-5">4Ever Inner Circle</div>
            <h3 className="text-2xl font-light text-ink mb-3">Members only</h3>
            <p className="text-sm text-whisper leading-relaxed mb-8">
              This is part of the private Inner Circle, available exclusively to couples booked with 4Ever Photos.
              If that is you, check your inbox for your invitation email. Already set up? Sign in below.
            </p>
            <Link
              href="/login"
              className="block text-[11px] tracking-label uppercase border border-plum text-plum px-6 py-3 hover:bg-plum hover:text-cream transition-colors mb-4"
            >
              Sign in to the Inner Circle
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-whisper hover:text-ink transition-colors underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

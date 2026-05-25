'use client'

import { useState, useEffect } from 'react'

// The iOS Safari share icon — square with arrow pointing up
function ShareIcon() {
  return (
    <span className="inline-flex items-center justify-center align-middle mx-0.5">
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle' }}>
        <rect x="1" y="6" width="14" height="11" rx="1.5" stroke="#2E3528" strokeWidth="1.4" fill="none" />
        <line x1="8" y1="1" x2="8" y2="12" stroke="#2E3528" strokeWidth="1.4" strokeLinecap="round" />
        <polyline points="4.5,4.5 8,1 11.5,4.5" stroke="#2E3528" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </span>
  )
}

export default function InstallNudge() {
  const [show, setShow] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void } | null>(null)

  useEffect(() => {
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent) || window.innerWidth < 768
    if (!isMobile) return
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('pwa-nudge-dismissed')) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIos(ios)

    if (ios) {
      setShow(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as Event & { prompt: () => void })
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    localStorage.setItem('pwa-nudge-dismissed', '1')
    setShow(false)
  }

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    dismiss()
  }

  if (!show) return null

  return (
    <div className="mx-8 md:mx-16 mb-8 border border-plum bg-blush-soft px-6 py-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-[10px] tracking-label uppercase text-plum mb-1">Important — do this first</p>
          <p className="text-sm font-light text-ink">Add your Inner Circle to your home screen now</p>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 text-[10px] tracking-label uppercase text-whisper hover:text-ink transition-colors mt-0.5"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      {isIos ? (
        <div className="space-y-2.5">
          <div className="flex gap-3 items-start">
            <span className="text-[10px] tracking-label uppercase text-plum font-medium mt-0.5 flex-shrink-0">Step 1</span>
            <p className="text-xs text-whisper leading-relaxed">
              Look for this icon <ShareIcon /> in the bar at the top of your Safari browser. If you can't see it straight away, tap the <span className="font-medium text-ink">•••</span> button and it will be in there.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-[10px] tracking-label uppercase text-plum font-medium mt-0.5 flex-shrink-0">Step 2</span>
            <p className="text-xs text-whisper leading-relaxed">
              Scroll down the menu that appears and tap <span className="font-medium text-ink">Add to Home Screen</span>, then tap <span className="font-medium text-ink">Add</span> in the top right corner.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-[10px] tracking-label uppercase text-plum font-medium mt-0.5 flex-shrink-0">Done</span>
            <p className="text-xs text-whisper leading-relaxed">
              Your Inner Circle lives on your phone like its own app — open any time, instant access, no link needed.
            </p>
          </div>
          <p className="text-[10px] text-whisper pt-1 border-t border-plum/15 leading-relaxed">
            If you can't find it right now, just go to{' '}
            <a href="/#signin" className="underline text-plum/70">our website</a>
            {' '}and at the bottom you can request a new link any time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-whisper leading-relaxed">
            Tap the button below to add your Inner Circle to your home screen. It takes ten seconds and from that moment it lives on your phone like its own app — open any time, instant access, no link needed.
          </p>
          {deferredPrompt && (
            <button
              onClick={install}
              className="text-[10px] tracking-label uppercase text-cream bg-plum px-4 py-2 hover:bg-plum/80 transition-colors"
            >
              Add to home screen
            </button>
          )}
          <p className="text-[10px] text-whisper leading-relaxed">
            If you can't find it right now, just go to{' '}
            <a href="/#signin" className="underline text-plum/70">our website</a>
            {' '}and at the bottom you can request a new link any time.
          </p>
        </div>
      )}
    </div>
  )
}

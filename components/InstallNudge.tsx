'use client'

import { useState, useEffect } from 'react'

export default function InstallNudge() {
  const [show, setShow] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void } | null>(null)

  useEffect(() => {
    // Only show on mobile devices — no point adding to home screen on desktop
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent) || window.innerWidth < 768
    if (!isMobile) return
    // Don't show if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // Don't show if dismissed before
    if (localStorage.getItem('pwa-nudge-dismissed')) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIos(ios)

    if (ios) {
      setShow(true)
      return
    }

    // Android / Chrome: listen for install prompt
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
    <div className="mx-8 md:mx-16 mb-8 border border-plum bg-blush-soft px-6 py-5 flex items-start gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] tracking-label uppercase text-plum mb-1">Important — do this first</p>
        <p className="text-sm font-light text-ink mb-2">Add your Inner Circle to your home screen now</p>
        {isIos ? (
          <p className="text-xs text-whisper leading-relaxed">
            Tap the <span className="font-medium text-ink">Share icon</span> at the bottom of your browser (the square with the arrow pointing up), then tap <span className="font-medium text-ink">Add to Home Screen</span>. It takes ten seconds and from that moment your Inner Circle lives on your phone like its own app — open any time, instant access, no link needed.
          </p>
        ) : (
          <p className="text-xs text-whisper leading-relaxed">
            Tap the button to add your Inner Circle to your home screen. It takes ten seconds and from that moment it lives on your phone like its own app — open any time, instant access, no link needed.
          </p>
        )}
      </div>
      <div className="flex-shrink-0 flex items-center gap-3 mt-0.5">
        {!isIos && deferredPrompt && (
          <button
            onClick={install}
            className="text-[10px] tracking-label uppercase text-cream bg-plum px-4 py-2 hover:bg-plum/80 transition-colors whitespace-nowrap"
          >
            Add
          </button>
        )}
        <button
          onClick={dismiss}
          className="text-[10px] tracking-label uppercase text-whisper hover:text-ink transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

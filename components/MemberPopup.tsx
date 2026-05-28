'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MemberPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('member-popup-dismissed')) return
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)
    sessionStorage.setItem('member-popup-dismissed', '1')
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-plum border border-plum-deep shadow-[0_20px_60px_rgba(74,31,61,0.4)] max-w-[280px] w-full">
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-3 right-4 text-cream/40 hover:text-cream transition-colors text-xl leading-none"
      >
        ×
      </button>
      <div className="px-6 pt-6 pb-5">
        <div className="text-[10px] tracking-label uppercase text-mauve-soft mb-2">4Ever Inner Circle</div>
        <p className="text-lg font-light text-cream mb-1">Already a member?</p>
        <p className="text-sm text-cream/60 mb-5">Sign in to your private Inner Circle.</p>
        <Link
          href="/login"
          onClick={dismiss}
          className="block text-center text-[11px] tracking-label uppercase border border-mauve-soft text-mauve-soft px-5 py-3 hover:bg-mauve hover:border-mauve hover:text-cream transition-colors"
        >
          Sign in here
        </Link>
      </div>
    </div>
  )
}

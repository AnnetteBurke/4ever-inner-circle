'use client'

import { useState } from 'react'

const NAV_LINKS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'journey',   label: 'Journey' },
  { id: 'people',    label: 'People' },
  { id: 'mood',      label: 'Mood' },
  { id: 'calm',      label: 'Calm Corner' },
  { id: 'edit',      label: 'The Edit' },
]

export default function Nav({
  activeSection = '',
  onSectionClick,
}: {
  activeSection?: string
  onSectionClick?: (id: string) => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleClick(id: string) {
    onSectionClick?.(id)
    setMobileOpen(false)
  }

  const mobileNavBg = mobileOpen
    ? 'bg-cream border-b border-hairline'
    : 'bg-transparent'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${mobileNavBg} md:bg-cream/95 md:backdrop-blur-md md:border-b md:border-hairline transition-colors`}>
      <div className="max-w-container mx-auto flex items-center justify-between px-12 py-5">

        {/* Logo */}
        <button type="button" onClick={() => handleClick('')} className="focus:outline-none">
          <img
            src="/brand/Inner Circle Landscap.svg"
            alt="4Ever Inner Circle"
            className="h-9 w-auto block md:hidden"
            style={mobileOpen ? { filter: 'invert(1) hue-rotate(180deg)' } : undefined}
          />
          <img
            src="/brand/Inner Circle Landscap.svg"
            alt="4Ever Inner Circle"
            className="h-9 w-auto hidden md:block"
            style={{ filter: 'invert(1) hue-rotate(180deg)' }}
          />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleClick(link.id)}
              className={`text-xs tracking-small-caps uppercase transition-colors ${
                activeSection === link.id
                  ? 'text-mauve'
                  : 'text-charcoal hover:text-mauve'
              }`}
            >
              {link.label}
            </button>
          ))}
          <a
            href="/login"
            className="text-[11px] tracking-label uppercase text-plum border border-plum/40 px-4 py-2 hover:bg-plum hover:text-cream transition-colors"
          >
            Sign in
          </a>
        </div>

        {/* Mobile: sign in + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <a
            href="/login"
            className={`text-[11px] tracking-label uppercase px-4 py-2 border transition-colors ${
              mobileOpen
                ? 'text-plum border-plum/40'
                : 'text-cream border-cream/40'
            }`}
          >
            Sign in
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(o => !o)}
            className={`p-1 transition-colors ${mobileOpen ? 'text-ink' : 'text-cream'}`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cream">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleClick(link.id)}
              className={`w-full text-left px-12 py-4 text-xs tracking-small-caps uppercase border-t border-hairline transition-colors ${
                activeSection === link.id
                  ? 'text-mauve'
                  : 'text-charcoal hover:text-mauve'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

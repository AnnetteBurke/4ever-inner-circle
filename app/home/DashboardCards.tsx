'use client'

import Link from 'next/link'
import { useState, useRef, useCallback } from 'react'

type Feature = {
  label: string
  tag: string
  desc: string
  href: string
  videoSrc?: string
  comingSoon?: boolean
  comingDate?: string
}

function FeatureCard({ feature }: { feature: Feature }) {
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    if (videoRef.current && feature.videoSrc) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }, [feature.videoSrc])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [])

  if (feature.comingSoon) {
    return (
      <Link
        href={feature.href}
        className="block bg-cream p-8 hover:bg-blush-soft transition-colors h-full"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="text-[10px] tracking-label uppercase text-whisper">{feature.tag}</div>
          <div className="text-[10px] tracking-label uppercase text-plum border border-plum/30 px-2 py-0.5 flex-shrink-0">
            Coming {feature.comingDate}
          </div>
        </div>
        <h3 className="text-2xl font-light text-ink/60 mb-3">{feature.label}</h3>
        <p className="text-sm text-whisper/70 leading-relaxed">{feature.desc}</p>
      </Link>
    )
  }

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={feature.href}
        className="block bg-cream p-8 hover:bg-blush-soft transition-colors h-full"
      >
        <div className="text-[10px] tracking-label uppercase text-mauve mb-3">{feature.tag}</div>
        <h3 className="text-2xl font-light text-ink mb-3 group-hover:text-plum transition-colors">
          {feature.label}
        </h3>
        <p className="text-sm text-whisper leading-relaxed">{feature.desc}</p>
      </Link>

      {feature.videoSrc && (
        <div
          className={`absolute bottom-4 right-4 pointer-events-none transition-all duration-300 ${
            hovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'
          }`}
          style={{ zIndex: 10 }}
        >
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-blush-deep/40 blur-sm scale-110" />
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-cream shadow-[0_8px_30px_rgba(74,31,61,0.25)]">
              <video
                ref={videoRef}
                src={feature.videoSrc}
                muted
                playsInline
                loop
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const features: Feature[] = [
  {
    label: 'Our Circle',
    tag: 'Your people',
    desc: 'Add your bridal party, family and suppliers. We brief everyone at the right moment.',
    href: '/home/people',
  },
  {
    label: 'Day Plan',
    tag: 'Your day',
    desc: 'Walk us through the shape of your day. The more we know, the more we can anticipate every moment.',
    href: '/home/day-plan',
  },
  {
    label: 'Shot Requests',
    tag: 'Photography',
    desc: 'Tell us the specific group moments and people you want captured, beyond the standard family groups.',
    href: '/home/shots',
  },
  {
    label: 'Calm Corner',
    tag: 'The Bodytap Method',
    desc: 'For the nerves, the worries, the butterflies and the big day itself. Five tapping sessions, gifted with our love.',
    href: '/home/calm',
    comingSoon: true,
    comingDate: 'August 2026',
  },
  {
    label: 'Your Photos',
    tag: 'Guest album',
    desc: 'A private shared album after the day. Yours, your family, your guests — every photo in one beautiful place.',
    href: '/home/share',
    comingSoon: true,
    comingDate: 'October 2026',
  },
  {
    label: 'The Edit',
    tag: 'Wedding shop',
    desc: 'A hand-picked collection of the things we love and recommend. Albums, prints, frames and more.',
    href: '/home/edit',
    comingSoon: true,
    comingDate: 'October 2026',
  },
]

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border border-hairline">
      {features.map((f) => (
        <FeatureCard key={f.href} feature={f} />
      ))}
    </div>
  )
}

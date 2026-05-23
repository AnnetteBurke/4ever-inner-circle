'use client'

import Link from 'next/link'
import { useState, useRef, useCallback } from 'react'

type Feature = {
  label: string
  tag: string
  desc: string
  href: string
  videoSrc?: string
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
            {/* Soft glow ring */}
            <div className="absolute inset-0 rounded-full bg-blush-deep/40 blur-sm scale-110" />
            {/* Video circle */}
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

// To activate a video: upload the .mp4 to the 'annette-videos' bucket in Supabase Storage,
// then uncomment the videoSrc line and replace the filename.
// URL format: https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/annette-videos/FILENAME.mp4

const features: Feature[] = [
  {
    label: 'Your Circle',
    tag: 'Your people',
    desc: 'Add your bridal party, family and suppliers. We brief everyone at the right moment.',
    href: '/home/people',
    // videoSrc: 'https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/annette-videos/circle.mp4',
  },
  {
    label: 'Day Plan',
    tag: 'Your day',
    desc: 'Walk us through the shape of your day. The more we know, the more we can anticipate every moment.',
    href: '/home/day-plan',
    // videoSrc: 'https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/annette-videos/day-plan.mp4',
  },
  {
    label: 'Shot Requests',
    tag: 'Photography',
    desc: 'Tell us the specific group moments and people you want captured, beyond the standard family groups.',
    href: '/home/shots',
    // videoSrc: 'https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/annette-videos/shots.mp4',
  },
  {
    label: 'Mood Board',
    tag: 'Your vision',
    desc: 'Your personal Pinterest, built in. Hair, flowers, venue, dress — all in one place, shared only with the right eyes.',
    href: '/home/mood',
    // videoSrc: 'https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/annette-videos/mood-board.mp4',
  },
  {
    label: 'Calm Corner',
    tag: 'The Bodytap Method',
    desc: 'For the nerves, the worries, the butterflies and the stress. Five tapping coins, gifted with our compliments.',
    href: '/home/calm',
    // videoSrc: 'https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/annette-videos/calm-corner.mp4',
  },
  {
    label: 'Gift List',
    tag: 'Photography gifts',
    desc: 'A mobile portrait studio at your venue, extra coverage, fine-art albums. Let the people who love you give to your story.',
    href: '/home/registry',
    // videoSrc: 'https://gthsnkpmkgxiirszbcau.supabase.co/storage/v1/object/public/annette-videos/gift-list.mp4',
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

'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import HeroSection from '@/components/sections/HeroSection'
import DashboardSection from '@/components/sections/DashboardSection'
import JourneySection from '@/components/sections/JourneySection'
import PeopleSection from '@/components/sections/PeopleSection'
import MoodSection from '@/components/sections/MoodSection'
import CalmSection from '@/components/sections/CalmSection'
import EditSection from '@/components/sections/EditSection'
import RegistrySection from '@/components/sections/RegistrySection'
import GuestAlbumSection from '@/components/sections/GuestAlbumSection'
import SignatureBlock from '@/components/sections/SignatureBlock'
import SignInSection from '@/components/sections/SignInSection'
import Footer from '@/components/Footer'
import MemberPopup from '@/components/MemberPopup'

const NAV_ORDER = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'journey',   label: 'Journey' },
  { id: 'people',    label: 'People' },
  { id: 'mood',      label: 'Mood' },
  { id: 'calm',      label: 'Calm Corner' },
  { id: 'edit',      label: 'The Edit' },
]

const SECTIONS: Record<string, React.ComponentType> = {
  dashboard: DashboardSection,
  journey:   JourneySection,
  people:    PeopleSection,
  mood:      MoodSection,
  calm:      CalmSection,
  edit:      EditSection,
}

export default function LandingPageClient() {
  const [activeSection, setActiveSection] = useState('')

  function handleSectionClick(id: string) {
    setActiveSection(id)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  const ActiveComponent = activeSection ? SECTIONS[activeSection] : null

  const currentIndex = NAV_ORDER.findIndex(s => s.id === activeSection)
  const nextSection = currentIndex >= 0 && currentIndex < NAV_ORDER.length - 1
    ? NAV_ORDER[currentIndex + 1]
    : null

  return (
    <>
      <Nav activeSection={activeSection} onSectionClick={handleSectionClick} />
      <main>
        {ActiveComponent ? (
          <ActiveComponent />
        ) : (
          <HeroSection />
        )}

        {nextSection && (
          <div className="border-t border-hairline bg-cream py-12 flex justify-center">
            <button
              type="button"
              onClick={() => handleSectionClick(nextSection.id)}
              className="group flex flex-col items-center gap-3 text-plum hover:text-mauve transition-colors"
            >
              <span className="text-[11px] tracking-label uppercase">Next</span>
              <span className="font-serif italic text-xl">{nextSection.label}</span>
              <svg
                width="32" height="32" viewBox="0 0 32 32" fill="none"
                className="group-hover:translate-y-1 transition-transform duration-200"
              >
                <path d="M16 6L16 26M16 26L8 18M16 26L24 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </main>
      <Footer />
      <MemberPopup />
    </>
  )
}

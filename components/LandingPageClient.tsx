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

  return (
    <>
      <Nav activeSection={activeSection} onSectionClick={handleSectionClick} />
      <main>
        {ActiveComponent ? (
          <ActiveComponent />
        ) : (
          <HeroSection />
        )}
      </main>
      <Footer />
      <MemberPopup />
    </>
  )
}

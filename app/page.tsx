import Nav from '@/components/Nav';
import HeroSection from '@/components/sections/HeroSection';
import DashboardSection from '@/components/sections/DashboardSection';
import JourneySection from '@/components/sections/JourneySection';
import PeopleSection from '@/components/sections/PeopleSection';
import MoodSection from '@/components/sections/MoodSection';
import CalmSection from '@/components/sections/CalmSection';
import EditSection from '@/components/sections/EditSection';
import RegistrySection from '@/components/sections/RegistrySection';
import GuestAlbumSection from '@/components/sections/GuestAlbumSection';
import SignatureBlock from '@/components/sections/SignatureBlock';
import Footer from '@/components/Footer';

/**
 * Inner Circle — public landing page
 *
 * This is the prospective preview that prospective couples see at
 * innercircle.4everphotos.uk. After they book and receive a magic
 * link, they'll log in and land on a private dashboard at /home.
 *
 * For now (Phase 1 session 1), this is the full marketing showcase
 * of what Inner Circle offers. Sections roughly follow the mockup.
 */
export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <DashboardSection />
        <JourneySection />
        <PeopleSection />
        <MoodSection />
        <CalmSection />
        <EditSection />
        <RegistrySection />
        <GuestAlbumSection />
        <SignatureBlock />
      </main>
      <Footer />
    </>
  );
}

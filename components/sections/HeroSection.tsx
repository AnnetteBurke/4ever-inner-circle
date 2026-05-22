import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="hero-bg relative overflow-hidden">

      {/* Mobile layout */}
      <div className="md:hidden">
        {/* Full-height image — nav logo floats over the top left */}
        <div className="relative w-full h-[65vh] bg-cream">
          <Image
            src="/images/hero-couple.jpg"
            alt="Bride and groom"
            fill
            className="object-contain object-center"
            priority
          />
        </div>
        {/* Text below the photo */}
        <div className="text-center px-8 pt-10 pb-16 bg-cream">
          <div className="label-tag mb-6">A private space for our couples</div>
          <h1 className="text-5xl font-light leading-[0.92] tracking-tight text-ink mb-2">
            The <span className="script-accent font-normal text-[0.92em] inline-block -translate-y-1.5">Inner</span> Circle
          </h1>
          <div className="font-serif italic text-2xl text-plum mt-3">
            Where your wedding day is quietly held
          </div>
          <div className="hairline mx-auto my-8" />
          <p className="text-base leading-[1.85] text-whisper">
            From the moment you book, we walk every step with you. A quiet, beautifully kept
            space for you, your people, your moments, looked after by 4Ever Photos.
          </p>
        </div>
      </div>

      {/* Desktop layout — unchanged */}
      <div className="hidden md:flex flex-col items-center justify-center text-center min-h-screen px-12 pt-32 pb-20 relative">
        <div className="absolute inset-0 pointer-events-none hero-image-fade" aria-hidden="true">
          <Image
            src="/images/hero-couple.jpg"
            alt=""
            fill
            className="object-contain object-right opacity-50"
            priority
          />
        </div>
        <div className="relative z-10 label-tag mb-8">A private space for our couples</div>
        <h1 className="relative z-10 text-8xl lg:text-9xl font-light leading-[0.92] tracking-tight text-ink mb-2">
          The <span className="script-accent font-normal text-[0.92em] inline-block -translate-y-1.5">Inner</span> Circle
        </h1>
        <div className="relative z-10 font-serif italic text-3xl text-plum mt-3">
          Where your wedding day is quietly held
        </div>
        <div className="relative z-10 hairline mx-auto my-8" />
        <p className="relative z-10 max-w-[540px] text-base leading-[1.85] text-whisper mt-10">
          From the moment you book, we walk every step with you. A quiet, beautifully kept
          space for you, your people, your moments, looked after by 4Ever Photos.
        </p>
        <div className="z-10 hidden lg:flex absolute bottom-12 left-0 right-0 justify-between items-center px-20 text-[11px] tracking-label uppercase text-whisper">
          <div className="flex items-center gap-2">
            <span className="font-script text-2xl text-mauve normal-case tracking-normal">by</span>
            4Ever Photos
          </div>
          <div>Members only · Est. 2026</div>
        </div>
      </div>

    </section>
  );
}

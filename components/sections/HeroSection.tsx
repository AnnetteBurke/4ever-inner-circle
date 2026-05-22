import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="hero-bg relative overflow-hidden">

      {/* Mobile layout */}
      <div className="md:hidden">
        {/* Photo fills full width — heading overlaid bottom-left */}
        <div className="relative w-full h-[65vh]">
          <Image
            src="/images/hero-couple.jpg"
            alt="Bride and groom"
            fill
            className="object-cover"
            style={{ objectPosition: '75% top' }}
            priority
          />
          {/* Gradient so text is readable over the photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
          {/* Label stacked on the left of the photo */}
          <div className="absolute left-6 top-[45%] max-w-[45%]">
            <p className="text-[11px] tracking-label uppercase text-cream/90 leading-relaxed font-medium">
              A private<br />space for<br />our wedding couples
            </p>
          </div>
        </div>
        {/* Heading and text tight under the photo */}
        <div className="text-center px-8 pt-6 pb-12 bg-cream">
          <h1 className="text-5xl font-light leading-[0.92] tracking-tight text-ink mb-3">
            The <span className="script-accent font-normal text-[0.92em] inline-block -translate-y-1.5">Inner</span> Circle
          </h1>
          <div className="font-serif italic text-2xl text-plum mt-2">
            Where the story of your day gathers into life
          </div>
          <div className="hairline mx-auto my-6" />
          <p className="text-base leading-[1.85] text-whisper">
            Thank you for choosing us to tell your love story. We built this space for you,
            your people, your plans, your dreams, all here to gather and come to life.
            Now make it yours. Add your first name.
          </p>
        </div>
      </div>

      {/* Desktop layout */}
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
        <div className="relative z-10 label-tag mb-8">A private space for our wedding couples</div>
        <h1 className="relative z-10 text-8xl lg:text-9xl font-light leading-[0.92] tracking-tight text-ink mb-2">
          The <span className="script-accent font-normal text-[0.92em] inline-block -translate-y-1.5">Inner</span> Circle
        </h1>
        <div className="relative z-10 font-serif italic text-3xl text-plum mt-3">
          Where the story of your day gathers into life
        </div>
        <div className="relative z-10 hairline mx-auto my-8" />
        <p className="relative z-10 max-w-[540px] text-base leading-[1.85] text-whisper mt-10">
          Thank you for choosing us to tell your love story. We built this space for you,
          your people, your plans, your dreams, all here to gather and come to life.
          Now make it yours. Add your first name.
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

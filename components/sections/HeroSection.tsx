import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="hero-bg flex flex-col items-center text-center relative overflow-hidden md:min-h-screen md:justify-center md:pt-32 md:pb-20">

      {/* Desktop only — floating image to the right */}
      <div className="absolute inset-0 pointer-events-none hero-image-fade hidden md:block" aria-hidden="true">
        <Image
          src="/images/hero-couple.jpg"
          alt=""
          fill
          className="object-contain object-right opacity-50"
          priority
        />
      </div>

      {/* Mobile only — image stacked above text, cropped to bouquet */}
      <div className="md:hidden w-full h-[340px] relative overflow-hidden">
        <Image
          src="/images/hero-couple.jpg"
          alt=""
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Text content */}
      <div className="relative z-10 px-8 pt-10 pb-16 md:px-12 md:pt-0 md:pb-0">
        <div className="label-tag mb-8">A private space for our couples</div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light leading-[0.92] tracking-tight text-ink mb-2">
          The <span className="script-accent font-normal text-[0.92em] inline-block -translate-y-1.5">Inner</span> Circle
        </h1>

        <div className="font-serif italic text-2xl md:text-3xl text-plum mt-3">
          Where your wedding day is quietly held
        </div>

        <div className="hairline mx-auto my-8" />

        <p className="max-w-[540px] mx-auto text-base leading-[1.85] text-whisper mt-10">
          From the moment you book, we walk every step with you. A quiet, beautifully kept
          space for you, your people, your moments, looked after by 4Ever Photos.
        </p>
      </div>

      <div className="z-10 hidden lg:flex absolute bottom-12 left-0 right-0 justify-between items-center px-20 text-[11px] tracking-label uppercase text-whisper">
        <div className="flex items-center gap-2">
          <span className="font-script text-2xl text-mauve normal-case tracking-normal">by</span>
          4Ever Photos
        </div>
        <div>Members only · Est. 2026</div>
      </div>
    </section>
  );
}

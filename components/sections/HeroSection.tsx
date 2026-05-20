export default function HeroSection() {
  return (
    <section className="hero-bg min-h-screen flex flex-col items-center justify-center text-center px-12 pt-32 pb-20 relative">
      <div className="label-tag mb-8">A private space for our couples</div>

      <h1 className="text-6xl md:text-8xl lg:text-9xl font-light leading-[0.92] tracking-tight text-ink mb-2">
        The <span className="script-accent font-normal text-[0.92em] inline-block -translate-y-1.5">Inner</span> Circle
      </h1>

      <div className="font-serif italic text-2xl md:text-3xl text-plum mt-3">
        a wedding experience, considered
      </div>

      <div className="hairline mx-auto my-8" />

      <p className="max-w-[540px] text-base leading-[1.85] text-whisper mt-10">
        From the moment you book, we walk every step with you. A quiet, beautifully kept
        space for your people, your moments, your plans — looked after by 4Ever Photos.
      </p>

      <div className="hidden lg:flex absolute bottom-12 left-0 right-0 justify-between items-center px-20 text-[11px] tracking-label uppercase text-whisper">
        <div className="flex items-center gap-2">
          <span className="font-script text-2xl text-mauve normal-case tracking-normal">by</span>
          4Ever Photos
        </div>
        <div>Members only · Est. 2026</div>
      </div>
    </section>
  );
}

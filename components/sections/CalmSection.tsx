export default function CalmSection() {
  return (
    <section
      id="calm"
      className="py-32 md:py-36 border-t border-hairline"
      style={{ background: 'linear-gradient(180deg, #F5E2DD 0%, #F0D5D0 100%)' }}
    >
      <div className="max-w-container mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="aspect-[4/5] rounded-sm relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-blush-soft to-blush">
            <div className="font-script text-[220px] text-plum opacity-40 leading-none">calm</div>
            <div className="absolute bottom-6 left-6 text-[10px] tracking-label uppercase text-plum">
              Calm Corner · Bodytap
            </div>
          </div>
          <div>
            <span className="label-tag">Calm Corner</span>
            <h3 className="text-4xl md:text-5xl font-light leading-tight text-ink mb-6 mt-4">
              For the <span className="script-accent font-normal">nerves</span>, the racing thoughts, the morning butterflies.
            </h3>
            <p className="text-base leading-[1.85] text-whisper mb-5">
              Inside your Inner Circle, you have private access to Bodytap — gentle,
              science-backed tapping sequences for wedding nerves, family stress, sleep,
              and confidence.
            </p>
            <div className="font-serif italic text-xl leading-relaxed text-plum pl-6 py-6 border-l border-mauve my-8">
              &ldquo;The morning of, I sat with my coffee and did the 8-minute calm sequence.
              By the time the dress was on, I felt like myself again.&rdquo;
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mauve-soft to-mauve flex items-center justify-center text-white font-script text-2xl shadow-lg">
                5
              </div>
              <div className="font-serif italic text-lg text-plum">
                Five tapping coins, gifted with our compliments
              </div>
            </div>
            <a
              href="#"
              className="inline-block mt-7 px-9 py-4 text-[11px] tracking-label uppercase border border-mauve text-mauve hover:bg-mauve hover:text-cream transition-colors"
            >
              Enter Calm Corner
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

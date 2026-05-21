import Image from 'next/image'

/* Sample dashboard preview (marketing-side mockup of the private dashboard).
   The real private dashboard is built in Phase 1 session 4. */

const cards = [
  { title: 'Your people', meta: '14 added · 3 awaiting role', cta: 'Open list →' },
  { title: 'This week', meta: "Bridesmaids' dress fitting confirmation due Friday", cta: '2 actions waiting' },
  { title: 'Shot planner', meta: '18 looks saved · sunset 7:42pm', cta: 'Refine →' },
  { title: 'The Edit', meta: 'Curated wedding essentials', cta: 'Browse shop →' },
  { title: 'Calm Corner', meta: '5 tapping coins gifted to you', cta: 'Open Bodytap →' },
  { title: 'Photography gift list', meta: '3 of 8 upgrades funded by guests', cta: 'View registry →' }
];

export default function DashboardSection() {
  return (
    <section id="dashboard" className="py-32 md:py-36 border-t border-hairline relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none hero-image-fade" aria-hidden="true">
        <Image
          src="/images/dashboard-bg.jpg"
          alt=""
          fill
          className="object-contain object-top md:object-right opacity-50"
        />
      </div>

      <div className="relative z-10 max-w-container mx-auto px-12">
        <div className="mb-20 max-w-[720px]">
          <span className="label-tag">Home of your wedding photography</span>
          <h2 className="text-5xl md:text-6xl font-light leading-tight text-ink mb-6 mt-4">
            Welcome, <span className="script-accent font-normal">Sarah &amp; James</span>
          </h2>
          <p className="text-base leading-[1.85] text-whisper max-w-[560px]">
            A private space designed to quietly remove the stress from your day — keeping
            your people, your timeline, and every detail beautifully organised, so that
            when the moment arrives, all you need to do is breathe.
          </p>
        </div>

        <div className="bg-white border border-hairline p-8 md:p-14 shadow-[0_30px_80px_-40px_rgba(74,31,61,0.18)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mauve to-transparent" />

          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-14">
            <div>
              <div className="label-tag mb-3">Counting down</div>
              <h3 className="text-5xl font-light leading-none text-ink">
                To your <span className="script-accent font-normal text-[0.85em]">forever</span>
              </h3>
              <div className="font-serif italic text-lg text-mauve mt-2">
                Saturday, 12 September 2026 · Cliveden House
              </div>
            </div>
            <div className="md:text-right md:pl-8 md:border-l md:border-hairline">
              <div className="font-serif font-light text-[88px] leading-none text-plum">116</div>
              <div className="text-[11px] tracking-label uppercase text-whisper mt-2">Days to go</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline">
            {cards.map((card) => (
              <div
                key={card.title}
                className="bg-white p-8 min-h-[200px] flex flex-col justify-between cursor-pointer hover:bg-cream transition-colors"
              >
                <div>
                  <h4 className="text-2xl font-normal text-ink mb-2">{card.title}</h4>
                  <p className="text-sm text-whisper leading-relaxed">{card.meta}</p>
                </div>
                <div className="text-[11px] tracking-small-caps uppercase text-mauve mt-5">
                  {card.cta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

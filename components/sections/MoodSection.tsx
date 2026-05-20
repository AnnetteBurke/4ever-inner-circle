const tiles = [
  { label: 'The first look · golden hour', span: 'col-span-2 row-span-2', tone: 'from-blush to-blush-deep' },
  { label: 'Ceremony aisle', span: 'col-span-2', tone: 'from-blush-soft to-mauve-soft' },
  { label: 'Bridal portrait — soft window light', span: 'col-span-2', tone: 'from-mauve-soft to-mauve text-white' },
  { label: 'Table styling', span: 'col-span-2', tone: 'from-blush-soft to-blush' },
  { label: 'Sunset on the lake · 7:42pm', span: 'col-span-2', tone: 'from-blush-deep to-mauve-soft' },
  { label: 'Family group · west lawn', span: 'col-span-3', tone: 'from-mauve to-plum text-cream' },
  { label: 'Final dance · 11:15pm', span: 'col-span-3', tone: 'from-blush to-blush-deep' }
];

export default function MoodSection() {
  return (
    <section id="mood" className="bg-blush-soft py-32 md:py-36 border-t border-hairline">
      <div className="max-w-container mx-auto px-12">
        <div className="mb-20 max-w-[720px]">
          <span className="label-tag">The mood</span>
          <h2 className="text-5xl md:text-6xl font-light leading-tight text-ink mb-6 mt-4">
            Your day, <span className="script-accent font-normal">visualised</span>
          </h2>
          <p className="text-base leading-[1.85] text-whisper max-w-[560px]">
            A living mood board — looks, light, locations, favourite corners of your venue.
            We&apos;ll plan around what matters to you, and use it on the day.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:auto-rows-[180px]">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className={`${tile.span} bg-gradient-to-br ${tile.tone} relative p-4 flex items-end overflow-hidden h-40 md:h-auto`}
            >
              <span className="font-serif italic text-base z-10 text-plum relative">
                {tile.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

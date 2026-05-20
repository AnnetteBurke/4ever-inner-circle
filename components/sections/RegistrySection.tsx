const gifts = [
  {
    label: 'Most loved',
    title: 'An extra hour',
    desc: 'For the moments after the cake — the slow drinks, the second dances, the quiet ones we don\'t want to miss.',
    price: '£240',
    progress: 78,
    by: '6 guests'
  },
  {
    label: 'Heirloom',
    title: 'Fine art album',
    desc: 'Italian-bound, hand-finished. The book your grandchildren will pull from the shelf one day.',
    price: '£680',
    progress: 34,
    by: '3 guests'
  },
  {
    label: 'Just the two of you',
    title: 'Day-after sunrise shoot',
    desc: 'A quiet hour, the morning after. No timeline, no guests — just you and the light.',
    price: '£420',
    progress: 12,
    by: '1 guest'
  }
];

export default function RegistrySection() {
  return (
    <section className="bg-plum text-cream py-32 md:py-36">
      <div className="max-w-container mx-auto px-12">
        <div className="mb-20 max-w-[720px]">
          <span className="label-tag !text-mauve-soft">Photography Gift List</span>
          <h2 className="text-5xl md:text-6xl font-light leading-tight text-cream mb-6 mt-4">
            Let those who love you, <span className="script-accent text-mauve-soft font-normal">give to your story</span>
          </h2>
          <p className="text-base leading-[1.85] text-cream/70 max-w-[560px]">
            Like a Prezola for your photographs. Guests can contribute to an extra hour
            of coverage, a fine-art album, a sunrise shoot — the things you&apos;d love
            but might not buy yourself.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {gifts.map((g) => (
            <div key={g.title} className="border border-cream/15 p-9 bg-cream/[0.02] hover:border-mauve-soft transition-colors">
              <div className="text-[10px] tracking-label uppercase text-mauve-soft mb-2">{g.label}</div>
              <h4 className="text-2xl font-normal text-cream mb-2 mt-2">{g.title}</h4>
              <div className="text-sm text-cream/60 leading-relaxed">{g.desc}</div>
              <div className="font-serif italic text-3xl text-mauve-soft mt-6 mb-4">{g.price}</div>
              <div className="h-px bg-cream/15 my-3 relative">
                <div className="absolute left-0 top-0 h-full bg-mauve-soft" style={{ width: `${g.progress}%` }} />
              </div>
              <div className="flex justify-between text-[11px] tracking-wider uppercase text-cream/55">
                <span>{g.progress}% funded</span>
                <span>by {g.by}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

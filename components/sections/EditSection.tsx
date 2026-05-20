const products = [
  { num: 'N° 01', silhouette: 'kit', tag: 'Essential', name: 'The Wedding Day Kit', price: '£68 · linen pouch', tone: 'from-blush-soft to-blush' },
  { num: 'N° 02', silhouette: 'guest', tag: 'Keepsake', name: 'Heirloom Guest Book', price: '£94 · hand-bound', tone: 'from-blush-deep to-mauve-soft' },
  { num: 'N° 03', silhouette: 'robe', tag: 'Morning of', name: 'Bridal Party Robes', price: 'From £62', tone: 'from-blush-soft to-blush-deep' },
  { num: 'N° 04', silhouette: 'ink', tag: 'Detail', name: 'Custom Calligraphy Set', price: 'From £40', tone: 'from-mauve-soft to-mauve' }
];

export default function EditSection() {
  return (
    <section id="edit" className="py-32 md:py-36 border-t border-hairline">
      <div className="max-w-container mx-auto px-12">
        <div className="mb-20 max-w-[720px]">
          <span className="label-tag">The Edit</span>
          <h2 className="text-5xl md:text-6xl font-light leading-tight text-ink mb-6 mt-4">
            Considered things, <span className="script-accent font-normal">for the day</span>
          </h2>
          <p className="text-base leading-[1.85] text-whisper max-w-[560px]">
            A curated wedding shop — emergency kits, guestbooks, getting-ready robes,
            calligraphy. Things we&apos;ve vetted, by people we trust.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p, i) => {
            const isMauve = i === 3;
            return (
              <div key={p.num} className="cursor-pointer group">
                <div className={`aspect-[3/4] mb-4 relative overflow-hidden bg-gradient-to-br ${p.tone} transition-transform group-hover:scale-[0.98]`}>
                  <div className={`absolute top-4 left-4 font-serif italic text-sm ${isMauve ? 'text-cream' : 'text-plum'}`}>
                    {p.num}
                  </div>
                  <div className={`absolute bottom-5 right-5 font-script text-[110px] leading-none ${isMauve ? 'text-cream/30' : 'text-plum/25'}`}>
                    {p.silhouette}
                  </div>
                </div>
                <div className="text-[10px] tracking-label uppercase text-whisper mb-2">{p.tag}</div>
                <h5 className="font-serif text-xl font-normal text-ink mb-1">{p.name}</h5>
                <div className="text-sm text-mauve tracking-wide">{p.price}</div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <a
            href="#"
            className="inline-block px-9 py-4 text-[11px] tracking-label uppercase border border-plum text-plum hover:bg-plum hover:text-cream transition-colors"
          >
            Open the full shop
          </a>
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image'

const tiles = [
  { src: '/images/mood-1.jpg', alt: 'Couple kissing under magnolia tree, veil flying', span: 'col-span-2 row-span-2' },
  { src: '/images/mood-2.jpg', alt: 'Jimmy Choo crystal shoes', span: 'col-span-2' },
  { src: '/images/mood-3.jpg', alt: 'Bride and bridesmaids with pink bouquets', span: 'col-span-2' },
  { src: '/images/mood-4.jpg', alt: 'Back of dress bow detail', span: 'col-span-2' },
  { src: '/images/mood-5.jpg', alt: 'Daddy reveal on the staircase', span: 'col-span-2' },
  { src: '/images/mood-6.jpg', alt: 'Couple under fairy lights canopy', span: 'col-span-3' },
  { src: '/images/guest-sparklers.jpg', alt: 'Sparklers at the wedding', span: 'col-span-3', pos: 'object-top' },
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

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:auto-rows-[220px]">
          {tiles.map((tile) => (
            <div
              key={tile.src}
              className={`${tile.span} relative overflow-hidden h-48 md:h-auto group`}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${tile.pos ?? 'object-center'}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

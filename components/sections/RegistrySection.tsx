import Image from 'next/image'

const gifts = [
  {
    label: 'The ultimate guest gift',
    title: 'The Portrait Studio',
    desc: 'Our team arrives with professional backdrop and lighting and photographs every guest — printed and mounted on the day. A red carpet moment for everyone who made the effort to be there and look their best.',
    price: 'Ask for pricing',
    progress: 62,
    by: '8 guests'
  },
  {
    label: 'Most popular album',
    title: 'The Framed Album',
    desc: '30 designed pages of your finest images, presented in a keepsake box with a clear front that opens like a picture frame. Our most-loved album — the one couples reach for first.',
    price: 'From £495',
    progress: 84,
    by: '11 guests'
  },
  {
    label: 'Just the two of you',
    title: 'Post-Wedding Experience',
    desc: 'Come back dressed up, somewhere personal — the stables, the racetrack, the spot where you were proposed to. No timeline, no guests. Just you, your story, and a day still being written.',
    price: 'Ask for pricing',
    progress: 45,
    by: '4 guests'
  },
  {
    label: 'More of the night',
    title: 'An Extra Hour',
    desc: 'Our sessions close at 9:30pm. An extra hour keeps us with you for the slow drinks, the second dances, the moments at the end of the night we\'d otherwise miss.',
    price: '£200 per hour',
    progress: 91,
    by: '14 guests'
  }
];

export default function RegistrySection() {
  return (
    <section className="bg-plum text-cream pt-32 md:pt-36 pb-32 md:pb-36">
      <div className="max-w-container mx-auto px-12">
        <div className="mb-16 max-w-[720px]">
          <span className="label-tag !text-mauve-soft">Photography Gift List</span>
          <h2 className="text-5xl md:text-6xl font-light leading-tight text-cream mb-6 mt-4">
            Let those who love you, <span className="script-accent text-mauve-soft font-normal">give to your story</span>
          </h2>
          <p className="text-base leading-[1.85] text-cream/70 max-w-[560px]">
            Let your family and friends contribute to the storytelling of your day.
            A photography gift list — for the experiences, the albums, and the moments
            you&apos;d love but might not buy yourself.
          </p>
        </div>
      </div>

      <div className="relative w-full h-[280px] md:h-[400px] overflow-hidden mb-16">
        <Image
          src="/images/registry-group.jpg"
          alt="Wedding guests celebrating together"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-plum/30" />
      </div>

      <div className="max-w-container mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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


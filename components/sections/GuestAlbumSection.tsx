import Image from 'next/image'

const collageImages = [
  { src: '/images/strip-2.jpg',           alt: 'Ceremony moment' },
  { src: '/images/guest-papparazzi.jpg',  alt: 'Wedding guests celebrating' },
  { src: '/images/mood-7.jpg',            alt: 'Dancing at the reception' },
  { src: '/images/guest-mum-dress.jpg',   alt: 'Mum helping with the dress' },
  { src: '/images/strip-1.jpg',           alt: 'Flowergirls' },
  { src: '/images/guest-getting-ready.jpg', alt: 'Getting ready' },
  { src: '/images/mood-5.jpg',            alt: 'Daddy reveal' },
  { src: '/images/guest-pageboys.jpg',    alt: 'Pageboys' },
  { src: '/images/guest-raining.jpg',     alt: 'A rainy moment' },
  { src: '/images/mood-3.jpg',            alt: 'Bridal party' },
  { src: '/images/guest-sneak.jpg',       alt: 'A quiet moment' },
  { src: '/images/mood-6.jpg',            alt: 'Fairy lights' },
];

export default function GuestAlbumSection() {
  return (
    <section className="py-32 md:py-36 border-t border-hairline">
      <div className="max-w-container mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          <div className="md:sticky md:top-32">
            <span className="label-tag">The shared album</span>
            <h3 className="text-4xl md:text-5xl font-light leading-tight text-ink mb-6 mt-4">
              Every guest, <span className="script-accent font-normal">a quiet contributor.</span>
            </h3>
            <p className="text-base leading-[1.85] text-whisper mb-5">
              After the day, your guests are invited — privately, with a single tap —
              to add the photographs and films they took. We weave them through your
              gallery so nothing is lost.
            </p>
            <p className="text-base leading-[1.85] text-whisper mb-5">
              A second perspective. The whispered moments. The dance floor through your
              aunt&apos;s eyes.
            </p>
            <a
              href="#"
              className="inline-block mt-4 px-9 py-4 text-[11px] tracking-label uppercase border border-mauve text-mauve hover:bg-mauve hover:text-cream transition-colors"
            >
              See an example album
            </a>
          </div>

          <div>
            <div className="grid grid-cols-4 gap-1">
              {collageImages.map((img) => (
                <div key={img.src} className="relative aspect-square overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            <div className="relative w-full h-[200px] md:h-[260px] mt-1 overflow-hidden">
              <Image
                src="/images/guest-primo.jpg"
                alt="The Primo guest album"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

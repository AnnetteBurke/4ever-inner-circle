import Image from 'next/image'

const collageImages = [
  { src: '/images/mood-7.jpg',              alt: 'Dancing at the reception' },
  { src: '/images/guest-papparazzi.jpg',    alt: 'Wedding guests celebrating' },
  { src: '/images/guest-new-2.jpg',         alt: 'Editorial portrait' },
  { src: '/images/guest-mum-dress.jpg',     alt: 'Mum helping with the dress' },
  { src: '/images/guest-new-5.jpg',         alt: 'Flowergirls' },
  { src: '/images/guest-getting-ready.jpg', alt: 'Getting ready' },
  { src: '/images/guest-new-4.jpg',         alt: 'Happy couple with family' },
  { src: '/images/guest-pageboys.jpg',      alt: 'Pageboys' },
  { src: '/images/guest-raining.jpg',       alt: 'A rainy moment' },
  { src: '/images/guest-new-6.jpg',         alt: 'Floral detail' },
  { src: '/images/guest-sneak.jpg',         alt: 'A quiet moment' },
  { src: '/images/guest-new-3.jpg',         alt: 'Walking through the forest' },
];

export default function GuestAlbumSection() {
  return (
    <section className="py-32 md:py-36 border-t border-hairline">
      <div className="max-w-container mx-auto px-12">

        {/* Top: copy + collage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          <div className="md:sticky md:top-32">
            <span className="label-tag">The shared album</span>
            <h3 className="text-4xl md:text-5xl font-light leading-tight text-ink mb-6 mt-4">
              Every guest, <span className="script-accent font-normal">a quiet contributor.</span>
            </h3>
            <p className="text-base leading-[1.85] text-whisper mb-5">
              Here is your personal QR code — share it with anyone who is part of your day.
              Guests, suppliers, the aunt who always has her phone out. Anyone who scans it
              can upload their photographs and films directly to your shared album.
            </p>
            <p className="text-base leading-[1.85] text-whisper mb-8">
              We will send it to everyone already in your Inner Circle, but this code is
              yours to share however and with whoever you like.
            </p>

            {/* QR code placeholder */}
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-36 h-36 border-2 border-ink p-2.5">
                <div className="w-full h-full grid grid-cols-7 gap-px opacity-80">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-ink rounded-[1px]"
                      style={{ opacity: Math.random() > 0.45 ? 1 : 0 }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] tracking-label uppercase text-mauve mb-2">Your code</div>
                <p className="text-sm text-whisper leading-relaxed">
                  Scan to upload photographs &amp; films to Sarah &amp; James&apos;s shared album.
                </p>
                <p className="text-xs text-whisper/60 mt-3 leading-relaxed">
                  Your unique code is generated when your Inner Circle is created.
                </p>
              </div>
            </div>
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

        {/* The Collective upsell */}
        <div className="mt-24 pt-16 border-t border-hairline grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="label-tag">The next step</span>
            <h3 className="text-4xl md:text-5xl font-light leading-tight text-ink mb-6 mt-4">
              Introducing <span className="script-accent font-normal">The Collective</span>
            </h3>
            <p className="text-base leading-[1.85] text-whisper mb-5">
              We take every image — yours, ours, theirs — and design a magazine-style album
              that tells the complete, collaborated story of your day. Your guests&apos; candid
              moments woven through our professional photography. One beautiful book that no
              single lens could have made alone.
            </p>
            <p className="text-base leading-[1.85] text-whisper mb-8">
              A second perspective. The whispered moments. The dance floor through your
              aunt&apos;s eyes. All of it, held together in print.
            </p>
            <div className="font-serif italic text-3xl text-mauve mt-2 mb-1">From £600</div>
            <div className="text-[11px] tracking-label uppercase text-whisper">Design &amp; print included</div>
          </div>
          <div className="bg-blush-soft p-10 border border-hairline">
            <div className="text-[10px] tracking-label uppercase text-mauve mb-6">What goes in</div>
            <ul className="space-y-4">
              {[
                'Your professional wedding photographs from 4Ever Photos',
                'Every upload from your guests and suppliers',
                'Designed in a magazine editorial style — full bleed, glossy, beautifully laid out',
                'Thinner pages mean the spine holds up to 100 spreads — far more than our traditional albums can take',
                'Think Hello magazine, not a coffee table book — hundreds of moments, nothing left out',
                'Delivered to your door',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-whisper leading-relaxed">
                  <span className="text-mauve mt-0.5 flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="inline-block mt-8 px-9 py-4 text-[11px] tracking-label uppercase border border-mauve text-mauve hover:bg-mauve hover:text-cream transition-colors"
            >
              Add to gift list
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

import Image from 'next/image'

export default function SignatureBlock() {
  return (
    <section className="text-center py-28 bg-cream border-t border-hairline">
      <div className="max-w-container mx-auto px-12">
        <div className="font-serif italic text-2xl md:text-3xl text-plum mb-8 max-w-[560px] mx-auto leading-[1.75]">
          There is a light that belongs<br />
          only to that day,<br />
          the particular way it fell<br />
          across the faces of everyone you love.<br />
          <br />
          Long after the flowers wilt<br />
          and the music finds its silence,<br />
          may you always hold a way back,<br />
          in the turn of a page,<br />
          in the light of a photograph,<br />
          to how it all felt.
        </div>
        <div className="relative h-20 w-64 mx-auto mb-2">
          <Image
            src="/images/signature.jpg"
            alt="Annette Burke signature"
            fill
            className="object-contain mix-blend-multiply"
          />
        </div>
        <div className="text-[11px] tracking-label uppercase text-mauve mb-8">
          Founder · 4Ever Photos
        </div>
        <div className="relative h-24 w-24 mx-auto">
          <Image
            src="/images/love-out-loud-stamp.jpg"
            alt="Love Out Loud"
            fill
            className="object-contain mix-blend-multiply"
          />
        </div>
      </div>
    </section>
  );
}

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
          in the quiet turn of a page,<br />
          in the light of a photograph,<br />
          to how it all felt.
        </div>
        {/*
          NOTE: This is a placeholder for Annette's real signature.
          Replace with an SVG of the actual handwritten signature
          (in /public/signature.svg) and swap the text below for an <Image>.
        */}
        <div className="font-signature text-5xl text-ink leading-none">Annette Burke</div>
        <div className="mt-2 text-[11px] tracking-label uppercase text-mauve">
          Founder · 4Ever Photos
        </div>
      </div>
    </section>
  );
}

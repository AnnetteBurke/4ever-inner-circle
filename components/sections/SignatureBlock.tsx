export default function SignatureBlock() {
  return (
    <section className="text-center py-28 bg-cream border-t border-hairline">
      <div className="max-w-container mx-auto px-12">
        <div className="font-serif italic text-2xl md:text-3xl text-plum mb-8 max-w-[600px] mx-auto leading-relaxed">
          &ldquo;We are looking after you. From the moment you book until long after the last dance —
          every detail, every person, every quiet moment.&rdquo;
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

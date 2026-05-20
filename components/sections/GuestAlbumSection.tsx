export default function GuestAlbumSection() {
  return (
    <section className="py-32 md:py-36 border-t border-hairline">
      <div className="max-w-container mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
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
          <div className="aspect-[4/5] rounded-sm relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-blush to-blush-deep">
            <div className="font-script text-[220px] text-plum opacity-40 leading-none">142</div>
            <div className="absolute bottom-6 left-6 text-[10px] tracking-label uppercase text-plum">
              guest contributions · Sarah &amp; James
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="bg-plum-deep text-cream py-24 pb-12">
      <div className="max-w-container mx-auto px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <div className="font-script text-6xl md:text-7xl leading-none text-cream">
              4ever
              <span className="inline-block font-sans font-semibold text-sm tracking-small-caps uppercase text-cream bg-mauve px-3.5 py-1.5 ml-1.5 align-middle -translate-y-2">
                Inner Circle
              </span>
            </div>
            <div className="font-serif italic text-lg text-mauve-soft mt-4">
              we are looking after you
            </div>
          </div>
          <div className="text-[11px] tracking-small-caps uppercase text-cream/55 leading-loose md:text-right">
            <div>By invitation</div>
            <div>By 4Ever Photos</div>
            <div>Made in the UK</div>
          </div>
        </div>
        <div className="pt-8 border-t border-cream/15 flex flex-col md:flex-row justify-between gap-2 text-[11px] tracking-small-caps uppercase text-cream/55">
          <div>© 2026 4Ever Photos · Inner Circle</div>
          <div>Concierge · Privacy · Members</div>
        </div>
      </div>
    </footer>
  );
}

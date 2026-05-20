const people = [
  { initial: 'E', name: 'Emma Whitfield', role: 'Maid of Honour', status: 'All briefed', next: 'Hair & makeup timing · in 14 days' },
  { initial: 'T', name: 'Tom Bradley', role: 'Best Man', status: 'Speech tips sent', next: 'Day-before rundown · in 55 days' },
  { initial: 'M', name: 'Margaret & David', role: 'Parents of the Bride', status: 'Awaiting note', next: 'Family photo plan · in 7 days' },
  { initial: 'P', name: 'Posy Florals', role: 'Supplier · Flowers', status: 'Shot list shared', next: 'Final brief · in 21 days' },
  { initial: 'L', name: 'Lottie Greene', role: 'Bridesmaid', status: 'All briefed', next: 'Getting-ready playlist · in 28 days' },
  { initial: 'J', name: 'James Mackenzie', role: 'Father of the Groom', status: 'Awaiting role', next: 'Welcome & intro · in 1 day' },
  { initial: 'S', name: 'Sophie Lane', role: 'Bridesmaid', status: 'All briefed', next: 'Day-of timeline · in 35 days' }
];

export default function PeopleSection() {
  return (
    <section id="people" className="py-32 md:py-36 border-t border-hairline">
      <div className="max-w-container mx-auto px-12">
        <div className="mb-20 max-w-[720px]">
          <span className="label-tag">Your circle</span>
          <h2 className="text-5xl md:text-6xl font-light leading-tight text-ink mb-6 mt-4">
            The people who&apos;ll be there, <span className="script-accent font-normal">cared for</span>
          </h2>
          <p className="text-base leading-[1.85] text-whisper max-w-[560px]">
            Add everyone with a role — parents, bridal party, ushers, suppliers. We&apos;ll
            guide each of them, gently, with what they need to know and when.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline border border-hairline">
          {people.map((p) => (
            <div key={p.name} className="bg-cream p-8 md:p-10 text-center hover:bg-white transition-colors">
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-white font-script text-3xl shadow-md bg-gradient-to-br from-mauve-soft to-blush">
                {p.initial}
              </div>
              <h5 className="font-serif text-2xl font-normal text-ink mb-1">{p.name}</h5>
              <div className="text-[11px] tracking-small-caps uppercase text-mauve mb-3">{p.role}</div>
              <div className="font-serif italic text-base text-whisper">{p.status}</div>
              <div className="mt-4 pt-4 border-t border-hairline text-xs text-whisper leading-relaxed">
                <strong className="text-ink font-medium block mb-1">Next message</strong>
                {p.next}
              </div>
            </div>
          ))}
          <div className="bg-transparent border border-dashed border-mauve-soft flex items-center justify-center text-mauve font-serif italic text-lg cursor-pointer hover:bg-blush-soft hover:border-mauve transition-colors p-8">
            + add someone
          </div>
        </div>
      </div>
    </section>
  );
}

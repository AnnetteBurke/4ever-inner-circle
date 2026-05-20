const stops = [
  { when: 'Booked', what: 'Inner Circle access & welcome film', isNow: false },
  { when: '−12 weeks', what: 'Mood board & shot inspiration', isNow: false },
  { when: '−8 weeks', what: 'Best man & bridesmaid prep notes sent', isNow: true },
  { when: '−2 weeks', what: 'Final timings, calming reminders', isNow: false },
  { when: '+1 week', what: 'Sneak peeks & guest album opens', isNow: false }
];

const sampleMessages = [
  {
    to: 'To: Tom, Best Man',
    channel: 'WhatsApp',
    body:
      '"Tom — eight weeks to go. Here\'s a quiet little guide on writing your speech: three stories, one laugh, one tear. We\'ve also dropped a Google Maps pin for the church..."',
    when: 'Sends 8 weeks before · Auto'
  },
  {
    to: 'To: Emma, Maid of Honour',
    channel: 'SMS',
    body:
      '"Hair & makeup begins at 8:30am at the bridal suite. We\'ve added it to your calendar with the address — and a little note on what to bring..."',
    when: 'Sends day before · Auto'
  },
  {
    to: 'To: Florals by Posy (supplier)',
    channel: 'Email',
    body:
      '"Are there any details of the arrangements you\'d love captured on the day? We\'ll make sure your work is photographed beautifully for your portfolio..."',
    when: 'Sends 3 weeks before · Auto'
  }
];

export default function JourneySection() {
  return (
    <section id="journey" className="bg-blush py-32 md:py-36">
      <div className="max-w-container mx-auto px-12">
        <div className="mb-20 max-w-[720px]">
          <span className="label-tag !text-plum">The journey</span>
          <h2 className="text-5xl md:text-6xl font-light leading-tight mb-6 mt-4 text-plum">
            Quiet care, <span className="script-accent font-normal">in the right rhythm</span>
          </h2>
          <p className="text-base leading-[1.85] text-whisper max-w-[560px]">
            From the moment you book, we&apos;ll be sending small, useful things — to you,
            to your bridal party, to your suppliers — at exactly the right moment.
          </p>
        </div>

        <div className="relative py-10">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-plum/25 hidden md:block" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
            {stops.map((stop) => (
              <div key={stop.when} className="text-center">
                <div
                  className={`w-3 h-3 rounded-full border mx-auto mb-6 ${
                    stop.isNow
                      ? 'bg-mauve border-mauve scale-150 shadow-[0_0_0_6px_rgba(168,107,133,0.2)]'
                      : 'bg-blush border-plum'
                  }`}
                />
                <div className="font-serif italic text-2xl text-plum mb-2">{stop.when}</div>
                <div
                  className={`text-xs tracking-small-caps uppercase leading-relaxed ${
                    stop.isNow ? 'text-plum font-medium' : 'text-whisper'
                  }`}
                  dangerouslySetInnerHTML={{ __html: stop.what.replace(/&/g, '&amp;') }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {sampleMessages.map((msg) => (
            <div key={msg.to} className="bg-cream border border-hairline p-7">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-hairline">
                <div className="text-[11px] tracking-small-caps uppercase text-plum font-medium">
                  {msg.to}
                </div>
                <div className="text-[10px] tracking-small-caps uppercase text-cream bg-mauve px-2 py-1">
                  {msg.channel}
                </div>
              </div>
              <div className="font-serif italic text-lg leading-relaxed text-ink">{msg.body}</div>
              <div className="mt-4 text-[11px] tracking-small-caps uppercase text-mauve font-medium">
                {msg.when}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

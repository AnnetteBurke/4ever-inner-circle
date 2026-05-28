import Image from 'next/image'
import MembersOnlyButton from '@/components/MembersOnlyButton'

export default function CalmSection() {
  return (
    <section
      id="calm"
      className="py-32 md:py-36 border-t border-hairline"
      style={{ background: 'linear-gradient(180deg, #F5E2DD 0%, #F0D5D0 100%)' }}
    >
      <div className="max-w-container mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="aspect-[4/5] rounded-sm relative overflow-hidden order-last md:order-first">
            <Image
              src="/images/calm-bride.jpg"
              alt="Bride, serene, veil over her face"
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="order-first md:order-last">
            <span className="label-tag">Calm Corner</span>
            <h3 className="text-4xl md:text-5xl font-light leading-tight text-ink mb-6 mt-4">
              For the <span className="script-accent font-normal">nerves</span>, the worries, the butterflies and the stress.
            </h3>
            <p className="text-base leading-[1.85] text-whisper mb-5">
              Inside your Inner Circle, you have private access to &ldquo;The Bodytap Method&rdquo;. This method is a gentle,
              science-backed tapping sequences for wedding nerves, family stress, sleep
              and confidence. For the bride who always dreamed of her dad walking her
              down the aisle, and the ache of planning that day without him. For the
              family member whose behaviour is keeping you awake, or the quiet dread
              of what his mother might think. Whatever is sitting heavy, there is
              something here for it.
            </p>
            <div className="font-serif italic text-xl leading-relaxed text-plum pl-6 py-6 border-l border-mauve my-8">
              &ldquo;Her mum had passed. She&apos;d been in tears for weeks. There were days
              she wasn&apos;t sure she could go through with it at all. On the morning of her
              wedding, she giggled getting into her dress. Not one tear. Her guests
              couldn&apos;t believe it was the same woman.&rdquo;
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mauve-soft to-mauve flex items-center justify-center text-white font-script text-2xl shadow-lg">
                5
              </div>
              <div className="font-serif italic text-lg text-plum">
                Five tapping coins, gifted with our compliments
              </div>
            </div>
            <MembersOnlyButton className="inline-block mt-7 px-9 py-4 text-[11px] tracking-label uppercase border border-mauve text-mauve hover:bg-mauve hover:text-cream transition-colors">
              Enter Calm Corner
            </MembersOnlyButton>
          </div>
        </div>

        {/* Three real stories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 pt-16 border-t border-mauve/20">
          <div className="bg-cream/60 p-8 border border-hairline">
            <div className="text-[10px] tracking-label uppercase text-mauve mb-4">The bride</div>
            <p className="font-serif italic text-lg leading-relaxed text-ink">
              &ldquo;She fainted when she was nervous, as she had done since she was a girl.
              At the chapel doors, she started to go. We tapped right there in the doorway.
              Within minutes the colour came back. She walked up that aisle on her own two feet
              and didn&apos;t look back.&rdquo;
            </p>
          </div>
          <div className="bg-cream/60 p-8 border border-hairline">
            <div className="text-[10px] tracking-label uppercase text-mauve mb-4">The groom</div>
            <p className="font-serif italic text-lg leading-relaxed text-ink">
              &ldquo;He was terrified. Couldn&apos;t get through a practice run without his
              voice breaking. We tapped around the nerves the week before. He stood up the
              next week, looked out at two hundred people, and didn&apos;t quiver once.&rdquo;
            </p>
          </div>
          <div className="bg-cream/60 p-8 border border-hairline">
            <div className="text-[10px] tracking-label uppercase text-mauve mb-4">The mother of the bride</div>
            <p className="font-serif italic text-lg leading-relaxed text-ink">
              &ldquo;She&apos;d been grieving and exhausted for months. We worked through it
              together, tapping around the loss. On the morning of the wedding, she giggled
              getting into her dress. Not one tear. Everyone was mesmerised.&rdquo;
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

import Link from 'next/link'

export default function SignInSection() {
  return (
    <section id="signin" className="bg-plum py-20 px-8">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-4">
          Already booked with us?
        </div>
        <h2 className="text-3xl md:text-4xl font-light text-cream mb-4 leading-tight">
          Already a member?
        </h2>
        <p className="text-cream/70 text-base leading-relaxed mb-10 max-w-md mx-auto">
          If we are capturing your wedding, your private Inner Circle is waiting for you.
          Sign in with your email and password to pick up right where you left off.
        </p>
        <Link
          href="/login"
          className="inline-block text-[11px] tracking-label uppercase border border-mauve-soft text-mauve-soft px-10 py-4 hover:bg-mauve hover:border-mauve hover:text-cream transition-colors"
        >
          Sign in to your Inner Circle
        </Link>
      </div>
    </section>
  )
}

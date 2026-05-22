import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center max-w-lg px-8">
        <div className="label-tag mb-6">Your Inner Circle</div>
        <h1 className="text-5xl font-light text-ink mb-4 leading-tight">
          Welcome back
        </h1>
        <p className="font-serif italic text-2xl text-plum mb-8">
          Your private space is ready.
        </p>
        <p className="text-base text-whisper leading-relaxed mb-10">
          You are logged in as {user.email}
        </p>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-[11px] tracking-label uppercase text-mauve border border-mauve px-8 py-3 hover:bg-mauve hover:text-cream transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}

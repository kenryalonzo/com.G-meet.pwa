import type { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Aperture handles your data.',
}

export default function PrivacyPage() {
  return (
    <div className="w-full bg-background text-foreground min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <p className="font-mono text-xs text-primary mb-3 tracking-wide">LEGAL</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated {new Date().getFullYear()}</p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h2]:font-medium [&_h2]:text-base [&_h2]:mb-2">
          <p>
            Aperture is a portfolio project that demonstrates a complete video‑calling
            product. This page explains, in plain terms, what happens to your data
            when you use it.
          </p>

          <section>
            <h2>What we collect</h2>
            <p>
              When you sign in with Google or GitHub, we store your name, email
              address and profile picture so we can identify you across sessions.
              We don&apos;t collect passwords — authentication is handled entirely by
              Google or GitHub.
            </p>
          </section>

          <section>
            <h2>Video and audio</h2>
            <p>
              Calls are relayed through Stream&apos;s video infrastructure. Camera and
              microphone access is requested directly by your browser and only
              used for the call you&apos;re in — nothing is recorded unless you
              explicitly start a recording.
            </p>
          </section>

          <section>
            <h2>What we don&apos;t do</h2>
            <p>
              We don&apos;t sell your data, run ads, or share it with third parties
              beyond the infrastructure providers (Google, GitHub, Stream) required
              to make the product work.
            </p>
          </section>

          <section>
            <h2>Deleting your data</h2>
            <p>
              You can permanently delete your account and associated data at any
              time from your account menu.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms for using Aperture.',
}

export default function TermsPage() {
  return (
    <div className="w-full bg-background text-foreground min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <p className="font-mono text-xs text-primary mb-3 tracking-wide">LEGAL</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-12">Last updated {new Date().getFullYear()}</p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h2]:font-medium [&_h2]:text-base [&_h2]:mb-2">
          <p>
            Aperture is a portfolio / demonstration project. It is provided
            as‑is, with no uptime guarantee, warranty, or support commitment.
          </p>

          <section>
            <h2>Using the product</h2>
            <p>
              You&apos;re welcome to sign in and try every feature — starting and
              scheduling meetings, joining calls, recording, and virtual
              backgrounds. Please don&apos;t use it to upload or share illegal content,
              harass other users, or attempt to disrupt the service.
            </p>
          </section>

          <section>
            <h2>Your content</h2>
            <p>
              You own whatever you say or share on a call. We don&apos;t claim any
              rights to it, and calls aren&apos;t recorded unless a participant
              starts a recording themselves.
            </p>
          </section>

          <section>
            <h2>Availability</h2>
            <p>
              Because this is a demo project, meetings and accounts may be reset
              or removed without notice. Don&apos;t rely on it for anything you
              can&apos;t afford to lose.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

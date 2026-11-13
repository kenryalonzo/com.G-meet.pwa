import Link from 'next/link'
import Logo from '@/components/logo'

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            A calm, fast video‑calling app, built to show up well.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <span>© {new Date().getFullYear()} Aperture</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

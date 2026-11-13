import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  compact?: boolean;
  className?: string;
  href?: string;
}

const Logo = ({ compact = false, className, href = "/" }: LogoProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center relative z-20 gap-2.5',
        className
      )}
      aria-label={compact ? "Go to homepage" : "Aperture homepage"}
    >
      <Image
        src="/logo.svg"
        alt=""
        width={28}
        height={19}
        className="h-5 w-auto shrink-0"
        aria-hidden="true"
        priority
      />
      {!compact && (
        <span className="font-semibold whitespace-nowrap text-lg tracking-tight text-foreground">
          Aperture
        </span>
      )}
    </Link>
  )
}

export default Logo

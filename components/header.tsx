"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from './ui/button'
import { Menu, LogOut, LayoutDashboard } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, getInitials } from '@/lib/utils'
import useCurrentUser from '@/hooks/use-current-user'
import { signOut } from 'next-auth/react'
import Logo from './logo'

const navItems = [
  { name: 'Features', href: '/#features' },
  { name: 'How it works', href: '/#how-it-works' },
]

const Header = () => {
  const user = useCurrentUser()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 transition-[background,border-color] duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md py-3 border-b border-border" : "py-5 border-b border-transparent"
      )}
    >
      <div className='max-w-6xl mx-auto flex items-center justify-between gap-4'>
        <div className="flex items-center gap-8">
          <Logo />

          <nav className='hidden lg:flex items-center gap-1'>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                className="hidden sm:flex gap-2"
                onClick={() => router.push('/dashboard')}
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.image ?? undefined} alt={user.name ?? "You"} />
                      <AvatarFallback className="bg-primary/15 text-primary font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer sm:hidden">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/sign-in"><Button variant="ghost">Sign in</Button></Link>
              <Link href="/sign-in"><Button>Start a call</Button></Link>
            </div>
          )}

          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant={"ghost"} size={"icon"} aria-label="Open menu">
                  <Menu className='size-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side={"right"} className='w-[280px] sm:w-[320px] p-6 flex flex-col'>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo className="mb-8" />

                <nav className='flex-1 flex flex-col space-y-1'>
                  {navItems.map((item) => (
                    <Link
                      href={item.href}
                      key={item.name}
                      className='text-base font-medium px-3 py-2.5 rounded-lg hover:bg-accent transition-colors'
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto space-y-3">
                  {user ? (
                    <>
                      <Button className='w-full' onClick={() => { setOpen(false); router.push('/dashboard') }}>
                        Dashboard
                      </Button>
                      <Button variant="outline" className='w-full' onClick={handleLogout}>
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/sign-in" className="w-full block">
                        <Button variant="outline" className='w-full' onClick={() => setOpen(false)}>
                          Sign in
                        </Button>
                      </Link>
                      <Link href="/sign-in" className="w-full block">
                        <Button className='w-full' onClick={() => setOpen(false)}>
                          Start a call
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header

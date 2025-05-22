"use client"

import Image from 'next/image'
import { useState } from 'react'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import Link from 'next/link'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import useCurrentUser from '@/hooks/use-current-user'

const navItems = ['Home', 'About', 'Service', 'Contact']

const Header = () => {

  const user = useCurrentUser()
  
  const [open, setOpen] = useState(false)
  return (
    <header className='sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8'>
        <div className='flex max-w-xl mx-auto items-center justify-center'>
            <Image 
            src='/logo.svg'
            alt='Google Meet'
            width={50}
            height={50}
            className='cursor-pointer'
            />
        <NavigationMenu className='hidden md:block'>
          <NavigationMenuList className='gap-2 rounded-full bg-background shadow px-2 py-1'>
            {navItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                {/* <NavigationMenuTrigger>{item}</NavigationMenuTrigger> */}
                {/* <NavigationMenuContent> */}
                  <NavigationMenuLink
                    asChild
                    className='group inline-flex h-9 w-max items-center justify-center rounded-full bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1'
                  >
                    <Link href={"#"}>
                      {item}
                    </Link>
                  </NavigationMenuLink>
                {/* </NavigationMenuContent> */}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/sign-in">
            <Button 
              className='rounded-full'
              variant={"outline"}
            >
              {user ? "Go to Dashboard" : "Sign In"}
            </Button>
          </Link>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className='md:hidden'
            >
              <Menu className='w-6 h-6'/>
            </Button>
          </SheetTrigger>
          <SheetContent side={"right"} className='w-64'>
            <nav className='flex flex-col space-y-4 mt-8'>
              {navItems.map((item, index) => (
                <Link 
                  href={"#"} 
                  key={index}
                  className='text-lg font-medium hover:text-primary'
                  onClick={() => setOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link href="/sign-in">
                <Button 
                  className='w-full mt-4 rounded-full'
                  variant={"outline"}
                >
                  Sign In
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        </div>

    </header>
  )
}

export default Header
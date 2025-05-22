/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import React from 'react'
import Header from '@/components/header'
import { Spotlight } from '@/components/ui/Spotlight'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import useCurrentUser from '@/hooks/use-current-user'


const page = () => {

  const user = useCurrentUser()

  return (
    <div className='flex flex-col w-full h-full relative overflow-x-hidden'>
      <Header />
      <div className='flex-1 w-full h-full flex md:items-center md:justify-center relative'>
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="gray-800"
        />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
        <h1 className="bg-opacity-50 bg-gradient-to-b from-gray-800 to-gray-950 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Connect <br /> Anywhere, Anytime.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-center text-base font-normal text-neutral-700">
          Bring your team together with our powerful and flexible communication
          platform. Whether you&apos;re in the office or on the go, stay connected and
          productive with our easy-to-use tools. Experience seamless
        </p>
        {/* ToDo: change text base on user session */}
        <Link
          href={user ? "/dashboard" : "/sign-in"}
          className='flex items-center justify-center mt-8'
        >
          <Button
            size={"lg"}
            className='rounded-full'
          >
            {user ? "Go to Dashboard" : "Get Started"}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default page
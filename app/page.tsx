"use client"

import React from 'react'
import { motion, Variants } from 'motion/react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { CallPreview } from '@/components/call-preview'
import { Zap, LayoutGrid, ShieldCheck, LogIn, CalendarClock, Link2, ArrowRight } from 'lucide-react'

import Header from '@/components/header'
import Logo from '@/components/logo'
import useCurrentUser from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'

const features = [
  {
    icon: Zap,
    title: "Up and running in one click",
    description: "No downloads, no setup. Sign in and you're in a room with a shareable link before the kettle boils.",
  },
  {
    icon: LayoutGrid,
    title: "Everyone, clearly in view",
    description: "A speaker view and adaptive grid that quietly keeps up with who's talking, so you don't have to.",
  },
  {
    icon: ShieldCheck,
    title: "Yours to control",
    description: "Blur your background, record what matters, and remove anyone — all without leaving the call.",
  },
]

const steps = [
  {
    icon: LogIn,
    title: "Sign in",
    description: "One click with Google or GitHub. No forms, no password to forget.",
  },
  {
    icon: CalendarClock,
    title: "Start now, or later",
    description: "Jump into an instant meeting, or schedule one for when everyone's free.",
  },
  {
    icon: Link2,
    title: "Share the link",
    description: "Send it to anyone with an Aperture account and they're in, in a tap.",
  },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const HomePage = () => {
  const user = useCurrentUser()
  const router = useRouter()

  return (
    <div className="w-full bg-background text-foreground overflow-x-hidden">
      <Header />

      <main>
        <section className="relative w-full px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-grain"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, oklch(0.25 0.04 58 / 0.25), transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-border bg-card/60 font-mono text-xs text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-live" />
                video calls, without the friction
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                className="text-5xl md:text-6xl font-semibold tracking-tight text-balance"
              >
                Be there.
                <br />
                Even from here.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
                className="mt-6 max-w-md text-lg text-muted-foreground"
              >
                Aperture is a fast, calm video‑calling app for people who&apos;d rather talk than fiddle with settings. Start instantly, or schedule for later — everyone joins with one link.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <Button
                  size="lg"
                  className="group"
                  onClick={() => router.push(user ? "/dashboard" : "/sign-in")}
                >
                  {user ? "Go to dashboard" : "Start a call"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push(user ? "/join-meeting" : "/sign-in")}
                >
                  Join with a link
                </Button>
              </motion.div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <CallPreview />
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28 px-4 border-t border-border">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              className="max-w-xl mb-16"
            >
              <p className="font-mono text-xs text-primary mb-3 tracking-wide">01 — WHY APERTURE</p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Built around the call, not around the menus.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 md:py-28 px-4 border-t border-border">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              className="max-w-xl mb-16"
            >
              <p className="font-mono text-xs text-primary mb-3 tracking-wide">02 — HOW IT WORKS</p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Three steps. No learning curve.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="font-mono text-sm text-muted-foreground mb-4">0{index + 1}</div>
                  <step.icon className="size-6 text-primary mb-4" />
                  <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 px-4 border-t border-border">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance">
              Your next meeting is one click away.
            </h2>
            <div className="mt-10">
              <Button size="lg" onClick={() => router.push(user ? "/dashboard" : "/sign-in")}>
                {user ? "Go to dashboard" : "Start a call"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

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
    </div>
  )
}

export default HomePage

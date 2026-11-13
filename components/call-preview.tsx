"use client"

import { motion } from "motion/react"
import { Mic, Video, ScreenShare, PhoneOff, Hand } from "lucide-react"
import { cn } from "@/lib/utils"

const participants = [
  { name: "A", hue: 58, speaking: true },
  { name: "M", hue: 230 },
  { name: "J", hue: 148 },
  { name: "S", hue: 330 },
  { name: "K", hue: 280 },
]

export function CallPreview({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
      className={cn(
        "relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/80">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-75 animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-live" />
          </span>
          wnd&#8209;7x2k&#8209;pqr
        </div>
        <div className="text-xs text-muted-foreground font-mono">05:42</div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3">
        {participants.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
            className={cn(
              "relative aspect-square rounded-xl flex items-center justify-center text-sm font-medium",
              i === 0 && "col-span-2 row-span-2 aspect-auto text-2xl"
            )}
            style={{
              background: `linear-gradient(135deg, oklch(0.32 0.05 ${p.hue}), oklch(0.2 0.03 ${p.hue}))`,
            }}
          >
            <span className="text-foreground/90">{p.name}</span>
            {p.speaking && (
              <motion.span
                className="absolute inset-0 rounded-xl ring-2 ring-primary"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            {i === 2 && (
              <span className="absolute bottom-1.5 right-1.5 flex items-center justify-center size-5 rounded-full bg-background/80">
                <Hand className="size-3 text-primary" />
              </span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 px-4 py-3.5 border-t border-border/80 bg-muted/40">
        {[Mic, Video, ScreenShare].map((Icon, i) => (
          <span key={i} className="flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground">
            <Icon className="size-3.5" />
          </span>
        ))}
        <span className="flex items-center justify-center size-8 rounded-full bg-destructive text-destructive-foreground">
          <PhoneOff className="size-3.5" />
        </span>
      </div>
    </motion.div>
  )
}

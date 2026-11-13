"use client"

import { Call } from "@stream-io/video-react-sdk"
import { Button } from "@/components/ui/button"
import { Copy, ArrowRight, Users } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface Props {
  call: Call
  variant: "upcoming" | "recent"
}

export function MeetingListItem({ call, variant }: Props) {
  const router = useRouter()
  const custom = call.state.custom as { title?: string } | undefined
  const title = custom?.title || "Instant meeting"
  const startsAt = call.state.startsAt
  const endedAt = call.state.endedAt
  const isLive = variant === "upcoming" && startsAt && new Date(startsAt).getTime() <= Date.now()

  const timeLabel = endedAt
    ? `Ended ${formatDistanceToNow(new Date(endedAt), { addSuffix: true })}`
    : isLive
      ? "Live now"
      : startsAt
        ? formatDistanceToNow(new Date(startsAt), { addSuffix: true })
        : "Ongoing"

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/${call.id}`)
    toast.success("Meeting link copied")
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
        <Users className="size-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{title}</p>
        <p className={`text-sm truncate ${isLive ? "text-live" : "text-muted-foreground"}`}>
          {timeLabel}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {variant === "upcoming" && (
          <>
            <Button variant="ghost" size="icon" onClick={copyLink} aria-label="Copy link">
              <Copy className="size-4" />
            </Button>
            <Button size="sm" onClick={() => router.push(`/${call.id}`)}>
              Join
              <ArrowRight className="size-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

"use client";

import ScheduleMeetingModal from '@/features/room/components/ScheduleMeetingModal';
import { MeetingListItem } from '@/features/room/components/meeting-list-item';
import { useUserCalls } from '@/features/room/hooks/use-user-calls';
import useCurrentUser from '@/hooks/use-current-user';
import { generateRoomId } from '@/lib/utils';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Loader2, Video, CalendarPlus, Link2, CalendarClock, History } from 'lucide-react';

const Page = () => {
  const router = useRouter()
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false)
  const user = useCurrentUser()
  const client = useStreamVideoClient()
  const { isLoading: isLoadingCalls, upcoming, recent, refresh } = useUserCalls({ userId: user?.id })

  const createInstantMeeting = async () => {
    if (!client || !user?.id) {
      toast.error("User session not available")
      return
    }

    try {
      setIsCreatingMeeting(true)
      const roomId = generateRoomId()
      const call = client.call("default", roomId)

      await call.getOrCreate({
        data: { starts_at: new Date().toISOString() },
      })

      router.push(`/${roomId}`)
    } catch (error) {
      console.error("Meeting creation error:", error)
      toast.error("Failed to create meeting. Please try again.")
    } finally {
      setIsCreatingMeeting(false)
    }
  }

  const firstName = user?.name?.split(' ')[0]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {firstName ? `Hey ${firstName}` : 'Your meetings'}
        </h1>
        <p className="text-muted-foreground mt-1">Start something now, or line something up for later.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <ActionCard
          title="New meeting"
          description="Starts right away"
          icon={<Video className="size-5" />}
          onClick={createInstantMeeting}
          disabled={isCreatingMeeting}
          loading={isCreatingMeeting}
        />
        <ActionCard
          title="Schedule"
          description="Pick a date and time"
          icon={<CalendarPlus className="size-5" />}
          onClick={() => setShowScheduleModal(true)}
        />
        <ActionCard
          title="Join a meeting"
          description="Have a link or code?"
          icon={<Link2 className="size-5" />}
          onClick={() => router.push('/join-meeting')}
        />
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
          <CalendarClock className="size-4" />
          Upcoming
        </div>

        {isLoadingCalls ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-10 text-center text-muted-foreground text-sm">
            Nothing scheduled yet.
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((call) => (
              <MeetingListItem key={call.id} call={call} variant="upcoming" />
            ))}
          </div>
        )}
      </section>

      {recent.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
            <History className="size-4" />
            Recent
          </div>
          <div className="space-y-2">
            {recent.map((call) => (
              <MeetingListItem key={call.id} call={call} variant="recent" />
            ))}
          </div>
        </section>
      )}

      <ScheduleMeetingModal
        isOpen={showScheduleModal}
        onClose={() => { setShowScheduleModal(false); refresh() }}
      />
    </div>
  )
}

const ActionCard = ({
  title,
  description,
  icon,
  onClick,
  disabled,
  loading
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className="group text-left rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent disabled:opacity-60 disabled:pointer-events-none"
  >
    <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {loading ? <Loader2 className="size-5 animate-spin" /> : icon}
    </div>
    <h3 className="font-medium">{title}</h3>
    <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
  </button>
)

export default Page

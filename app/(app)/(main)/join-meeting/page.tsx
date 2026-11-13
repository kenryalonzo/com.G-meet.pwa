"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import { toast } from 'sonner'
import { Loader2, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Page = () => {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const client = useStreamVideoClient()

  const extractRoomId = (value: string): string | null => {
    try {
      const urlObj = new URL(value.startsWith('http') ? value : `https://placeholder/${value}`);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      return pathParts[pathParts.length - 1] || null;
    } catch {
      return value.trim();
    }
  };

  const joinMeeting = async () => {
    if (!client) {
      toast.error("Connection error. Please refresh the page.");
      return;
    }

    const roomId = extractRoomId(url);
    if (!roomId || roomId.length < 6) {
      toast.error("Please enter a valid meeting ID or URL");
      return;
    }

    try {
      setIsJoining(true);
      const { calls } = await client.queryCalls({
        filter_conditions: { id: roomId }
      });

      if (calls.length > 0) {
        router.push(`/${roomId}`);
      } else {
        toast.error("Meeting not found. Please check the link.");
      }
    } catch (error) {
      console.error("Join meeting error:", error);
      toast.error("Failed to join meeting. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    joinMeeting();
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Join a meeting</h1>
        <p className="text-muted-foreground mt-1">Paste the link or code you were given.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="aperture.app/wnd-7x2k-pqr"
            className="h-12 pl-10"
            autoFocus
          />
        </div>
        <Button type="submit" size="lg" disabled={isJoining || !url.trim()} className="h-12">
          {isJoining ? <Loader2 className="size-4 animate-spin" /> : "Join"}
        </Button>
      </form>

      <ol className="mt-16 space-y-4 text-sm text-muted-foreground">
        <li className="flex gap-3"><span className="font-mono text-primary">01</span> Get the meeting link from whoever is hosting.</li>
        <li className="flex gap-3"><span className="font-mono text-primary">02</span> Paste it above and hit join.</li>
        <li className="flex gap-3"><span className="font-mono text-primary">03</span> Allow camera and microphone access when prompted.</li>
      </ol>
    </div>
  )
}

export default Page

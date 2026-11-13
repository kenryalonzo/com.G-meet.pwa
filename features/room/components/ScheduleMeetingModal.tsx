import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CalendarPlus, X, Send, UserPlus, Calendar, Check, Copy } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarUI } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import useCurrentUser from '@/hooks/use-current-user'
import { generateRoomId } from '@/lib/utils'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import { toast } from 'sonner'

interface ScheduleMeetingModalProps {
  isOpen: boolean
  onClose: () => void
}

const ScheduleMeetingModal = ({ isOpen, onClose }: ScheduleMeetingModalProps) => {
  const user = useCurrentUser()
  const client = useStreamVideoClient()
  const [isScheduling, setIsScheduling] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState('15:00')
  const [title, setTitle] = useState('Team meeting')
  const [description, setDescription] = useState('')
  const [participants, setParticipants] = useState<string[]>([])
  const [newParticipant, setNewParticipant] = useState('')
  const [meetingUrl, setMeetingUrl] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleAddParticipant = () => {
    const email = newParticipant.trim()
    if (email && /^\S+@\S+\.\S+$/.test(email) && !participants.includes(email)) {
      setParticipants([...participants, email])
      setNewParticipant('')
    } else if (email) {
      toast.error('Enter a valid email address')
    }
  }

  const removeParticipant = (email: string) => {
    setParticipants(participants.filter(p => p !== email))
  }

  const scheduledAt = () => {
    if (!date) return undefined
    const [hours, minutes] = time.split(':').map(Number)
    const meetingDate = new Date(date)
    meetingDate.setHours(hours, minutes, 0, 0)
    return meetingDate
  }

  const handleScheduleMeeting = async () => {
    const meetingDate = scheduledAt()
    if (!meetingDate || !client || !user?.id) {
      toast.error('Please fill in every required field')
      return
    }

    try {
      setIsScheduling(true)

      const roomId = generateRoomId()
      const call = client.call('default', roomId)
      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            title,
            description: description || undefined,
            created_by_name: user.name || user.email || undefined,
            created_by_image: user.image || undefined,
          },
        },
      })

      setMeetingUrl(`${window.location.origin}/${roomId}`)
      setShowSuccess(true)
      toast.success('Meeting scheduled', {
        description: format(meetingDate, "PPP 'at' p"),
      })
    } catch (error) {
      console.error('Error scheduling meeting:', error)
      toast.error('Could not schedule the meeting, please try again')
    } finally {
      setIsScheduling(false)
    }
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(meetingUrl)
    setCopied(true)
    toast.success('Link copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendInvites = () => {
    const meetingDate = scheduledAt()
    const subject = `Invitation: ${title}`
    const body = `You're invited to "${title}"${meetingDate ? ` on ${format(meetingDate, "PPP 'at' p")}` : ''}.\n\nJoin here: ${meetingUrl}`
    window.location.href = `mailto:${participants.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const resetForm = () => {
    setDate(new Date())
    setTime('15:00')
    setTitle('Team meeting')
    setDescription('')
    setParticipants([])
    setNewParticipant('')
    setShowSuccess(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm()
        onClose()
      }
    }}>
      <DialogContent className="max-w-md md:max-w-lg rounded-2xl">
        {showSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 bg-live/10 w-16 h-16 rounded-full flex items-center justify-center">
              <CalendarPlus className="text-live w-8 h-8" />
            </div>

            <DialogTitle className="text-2xl">Meeting scheduled</DialogTitle>

            <DialogDescription className="mt-2 text-base">
              Share the link below so people can join you.
            </DialogDescription>

            <div className="mt-6 bg-muted p-4 rounded-xl text-left">
              <div className="flex justify-between items-center mb-2 gap-3">
                <span className="font-medium truncate">{title}</span>
                <span className="text-sm text-muted-foreground shrink-0">
                  {(() => {
                    const d = scheduledAt()
                    return d ? format(d, 'MMM d, yyyy · h:mm a') : ''
                  })()}
                </span>
              </div>

              <div className="flex items-center mt-4 gap-2">
                <Input value={meetingUrl} readOnly className="flex-1" />
                <Button variant="secondary" size="icon" onClick={handleCopyLink} aria-label="Copy link">
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              </div>
            </div>

            {participants.length > 0 && (
              <div className="mt-4 text-left">
                <p className="text-sm text-muted-foreground mb-2">Invite by email:</p>
                <div className="flex flex-wrap gap-2">
                  {participants.map((email) => (
                    <span key={email} className="bg-muted px-2 py-1 rounded-md text-sm">
                      {email}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => { resetForm(); onClose() }}>
                Close
              </Button>

              {participants.length > 0 && (
                <Button onClick={handleSendInvites}>
                  <Send className="mr-2 size-4" />
                  Email invites
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <CalendarPlus className="text-primary w-8 h-8" />
              </div>

              <DialogTitle className="text-2xl">Schedule a meeting</DialogTitle>

              <DialogDescription className="mt-2">
                Pick a date and time — you&apos;ll get a shareable link right away.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <div>
                <Label htmlFor="title">Meeting title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  placeholder="Enter meeting title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  placeholder="What's this meeting about?"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full mt-1 justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarUI
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Invite participants (optional)</Label>
                <div className="flex mt-1">
                  <Input
                    type="email"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    placeholder="Enter an email address"
                    className="rounded-r-none"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddParticipant())}
                  />
                  <Button variant="secondary" className="rounded-l-none" onClick={handleAddParticipant} type="button">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>

                {participants.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {participants.map((email) => (
                      <div key={email} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center">
                        {email}
                        <button onClick={() => removeParticipant(email)} className="ml-2 text-muted-foreground hover:text-foreground">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => { resetForm(); onClose() }} disabled={isScheduling}>
                Cancel
              </Button>

              <Button onClick={handleScheduleMeeting} disabled={isScheduling}>
                <CalendarPlus className="mr-2 w-4 h-4" />
                {isScheduling ? 'Scheduling…' : 'Schedule meeting'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ScheduleMeetingModal

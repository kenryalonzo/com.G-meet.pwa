import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Check, Copy, Mail, Calendar, Share2, Clock, Users } from 'lucide-react'
import { toast } from 'sonner'
import useCurrentUser from '@/hooks/use-current-user'
import { format } from 'date-fns'
import { QRCodeSVG } from 'qrcode.react'

type Props = {
  isOpen: boolean
  onClose: () => void
  meetingUrl: string
}

const MeetingInfoModal = ({ isOpen, onClose, meetingUrl } : Props) => {
  const [copied, setCopied] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [emailSent, setEmailSent] = React.useState(false)
  const user = useCurrentUser()
  const meetingId = meetingUrl.split('/').pop() || ''
  const meetingDate = format(new Date(), 'EEEE, MMMM d, yyyy')
  const meetingTime = format(new Date(), 'h:mm a')

  const copyMeetingUrl = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl)
      toast.success("Meeting URL copied to clipboard")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy meeting URL:", error)
      toast.error("Failed to copy meeting URL")
    }
  }

  const shareViaEmail = () => {
    const subject = `Join my meeting on Aperture`
    const body = `Hi,\n\nYou're invited to join a meeting on Aperture.\n\nMeeting details:\n- Date: ${meetingDate}\n- Time: ${meetingTime}\n\nJoin using this link: ${meetingUrl}\n\nSee you there!`
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 3000)
  }

  const shareViaCalendar = () => {
    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour duration
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Aperture+Meeting&details=Join+the+meeting+at:+${encodeURIComponent(meetingUrl)}&dates=${format(startTime, 'yyyyMMdd\'T\'HHmmss')}/${format(endTime, 'yyyyMMdd\'T\'HHmmss')}`
    
    window.open(calendarUrl, '_blank')
  }

  const shareViaSystem = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my meeting',
        text: `Join my meeting on Aperture: ${meetingUrl}`,
        url: meetingUrl,
      })
      .catch((error) => {
        console.error('Sharing failed', error)
        toast.error('Sharing not supported in your browser')
      })
    } else {
      copyMeetingUrl()
      toast.info('Link copied - paste to share')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="text-primary" />
            Meeting Created Successfully!
          </DialogTitle>
          <DialogDescription>
            Share this information with participants to join the meeting
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="size-5 text-primary" />
                <h3 className="font-medium">Meeting Details</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="w-24 text-muted-foreground">Host:</span>
                  <span className="font-medium">{user?.name || 'You'}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-muted-foreground">Date:</span>
                  <span>{meetingDate}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-muted-foreground">Time:</span>
                  <span>{meetingTime}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-muted-foreground">ID:</span>
                  <span className="font-mono text-sm">{meetingId}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor='meeting-url' className='text-sm font-medium flex items-center gap-2'>
                <Share2 className="size-4" />
                Meeting Link
              </Label>
              
              <div className='flex items-center gap-2'>
                <Input 
                  id='meeting-url'
                  value={meetingUrl}
                  readOnly
                  className='flex-1 truncate'
                />
                <Button 
                  variant={copied ? "secondary" : "outline"}
                  size="icon"
                  onClick={copyMeetingUrl}
                  aria-label="Copy meeting URL"
                >
                  {copied ? <Check className='size-4' /> : <Copy className='size-4' />}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={shareViaEmail}
              >
                <Mail className="size-4" />
                Email
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={shareViaCalendar}
              >
                <Calendar className="size-4" />
                Calendar
              </Button>
              
              <Button 
                variant="secondary" 
                className="flex-1 gap-2"
                onClick={shareViaSystem}
              >
                <Share2 className="size-4" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-4 p-4 border border-dashed rounded-lg">
            <div className="text-center">
              <h3 className="font-medium mb-1">Join with QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Scan to join instantly on mobile
              </p>
            </div>
            
            <div className="p-3 bg-white rounded-lg">
              <QRCodeSVG 
                value={meetingUrl} 
                size={160}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={false}
              />
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Point your phone camera at the QR code
            </p>
          </div>
        </div>
        
        <DialogFooter className="border-t pt-4">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="mr-2"
          >
            Close
          </Button>
          <Button 
            onClick={() => {
              copyMeetingUrl()
              onClose()
            }}
          >
            Copy Link & Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MeetingInfoModal
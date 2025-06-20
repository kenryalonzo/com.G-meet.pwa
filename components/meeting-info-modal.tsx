import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  isOpen: boolean
  onClose: () => void
  meetingUrl: string
}

const MeetingInfoModal = ({ isOpen, onClose, meetingUrl } : Props) => {

    const [copied, setCopied] = React.useState(false)
    const copyMeetingUrl = async() => {
        try {
            await navigator.clipboard.writeText(meetingUrl)
            toast.success("Meeting URL copied to clipboard")
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 2000) // Reset after 2 seconds
        } catch (error) {
            console.error("Failed to copy meeting URL:", error)
            toast.error("Failed to copy meeting URL")
        }
    }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Meeting Information</DialogTitle>
                <DialogDescription>
                    Share this information with your participants to join the meeting.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
                <div className="space-y-2">
                    <Label htmlFor='meeting-url' className='text-sm font-medium'>
                        Meeting URL
                    </Label>
                    <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                        <Input 
                            id='meeting-url'
                            value={meetingUrl}
                            readOnly
                            className='flex-1'
                        />
                        <Button 
                            variant={'outline'}
                            size={'icon'}
                            onClick={copyMeetingUrl}
                        >
                            {copied ? (
                                <Check className='size-4 text-green-500' />
                            ) : (
                                <Copy className='size-4' />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default MeetingInfoModal
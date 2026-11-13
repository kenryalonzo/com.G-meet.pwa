import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DoorOpen, Users, CalendarPlus, LogOut, X } from 'lucide-react'
import { motion } from 'motion/react'
import ScheduleMeetingModal from './ScheduleMeetingModal'

interface Props {
  showLeaveAlert: boolean
  setShowLeaveAlert: (show: boolean) => void
}

const MeetingLeaveModal = ({ showLeaveAlert, setShowLeaveAlert }: Props) => {
  const call = useCall()
  const router = useRouter()
  const [isLeaving, setIsLeaving] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  // Utilisation de useLocalParticipant pour obtenir l'ID de l'utilisateur actuel
  const { useLocalParticipant } = useCallStateHooks()
  const localParticipant = useLocalParticipant()
  
  // Comparaison avec l'ID du créateur de l'appel
  const isOwner = call?.state.createdBy?.id === localParticipant?.userId

  const confirmLeave = async () => {
    if (!call) return
    
    try {
      setIsLeaving(true)
      await call.leave()
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to leave call:', error)
    } finally {
      setIsLeaving(false)
      setShowLeaveAlert(false)
    }
  }

  const endMeetingForAll = async () => {
    if (!call) return
    
    try {
      setIsLeaving(true)
      await call.endCall()
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to end call:', error)
    } finally {
      setIsLeaving(false)
      setShowLeaveAlert(false)
    }
  }

  return (
    <>
      <AlertDialog open={showLeaveAlert} onOpenChange={setShowLeaveAlert}>
        <AlertDialogContent className="max-w-md rounded-xl">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AlertDialogHeader className="text-center">
              <div className="mx-auto mb-4 bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center">
                <DoorOpen className="text-destructive w-8 h-8" />
              </div>
              
              <AlertDialogTitle className="text-2xl">
                Leave this meeting?
              </AlertDialogTitle>
              
              <AlertDialogDescription className="text-base mt-2">
                {isOwner 
                  ? "You're the host. If you leave, the meeting will end for all participants." 
                  : "The meeting will continue without you."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-6 space-y-4">
              {isOwner && (
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <p className="text-foreground font-medium flex items-center">
                    <Users className="mr-2 w-4 h-4 text-primary" />
                    Host privileges
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    As the host, you can end the meeting for everyone
                  </p>
                </div>
              )}
            </div>

            <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-3 sm:gap-2">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => setShowLeaveAlert(false)}
                disabled={isLeaving}
              >
                <X className="mr-2 w-4 h-4" /> Cancel
              </Button>
              
              <div className="flex flex-col w-full sm:w-auto space-y-2">
                <Button 
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setShowLeaveAlert(false)
                    setShowScheduleModal(true)
                  }}
                  disabled={isLeaving}
                >
                  <CalendarPlus className="mr-2 w-4 h-4" /> Schedule New
                </Button>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  {isOwner && (
                    <Button 
                      variant="destructive"
                      className="w-full sm:w-auto"
                      onClick={endMeetingForAll}
                      disabled={isLeaving}
                    >
                      {isLeaving ? (
                        <span className="flex items-center">
                          <span className="animate-pulse">Ending...</span>
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <LogOut className="mr-2 w-4 h-4" /> End for All
                        </span>
                      )}
                    </Button>
                  )}
                  
                  <Button 
                    variant={isOwner ? "outline" : "destructive"}
                    className="w-full sm:w-auto"
                    onClick={confirmLeave}
                    disabled={isLeaving}
                  >
                    {isLeaving ? (
                      <span className="flex items-center">
                        <span className="animate-pulse">Leaving...</span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <DoorOpen className="mr-2 w-4 h-4" /> 
                        {isOwner ? "Leave Only" : "Leave Meeting"}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
      
      <ScheduleMeetingModal 
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </>
  )
}

export default MeetingLeaveModal;
"use client";

import React, { useState } from 'react';
import {
  useCall,
  useCallStateHooks,
  DeviceSettings,
} from '@stream-io/video-react-sdk';
import {
  PhoneOff,
  ScreenShare,
  ScreenShareOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Users,
  Info,
  Sparkles,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { ParticipantsPanel } from './participants-panel';
import ImageSidebar from './image-sidebar';
import MeetingInfoModal from '@/components/meeting-info-modal';
import MeetingLeaveModal from './meeting-leave-modal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type BlurLevel = "none" | "low" | "medium" | "high" | "disable"

const CallControls = () => {
  const call = useCall();
  const { useMicrophoneState, useCameraState, useScreenShareState } = useCallStateHooks();

  const { microphone, isMute: isMicMute } = useMicrophoneState();
  const { camera, isMute: isCameraMute } = useCameraState();
  const { screenShare, isEnabled: isScreenSharing } = useScreenShareState();

  const [showParticipants, setShowParticipants] = useState(false);
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [blurLevel, setBlurLevel] = useState<BlurLevel>("none");
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [meetingUrl] = useState(() => (typeof window !== "undefined" ? window.location.href : ""));

  const isRecordingActive = !!call?.state.recording;

  const toggleRecording = async () => {
    try {
      if (isRecordingActive) {
        await call?.stopRecording();
        toast.success("Recording stopped", { description: "The meeting recording has been saved" });
      } else {
        await call?.startRecording();
        toast.info("Recording started", { description: "This meeting is now being recorded" });
      }
    } catch (error) {
      console.error("Failed to toggle recording", error);
      toast.error("Recording error");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-full shadow-2xl shadow-black/40">
        <ControlButton active={!isMicMute} onClick={() => microphone.toggle()} label={isMicMute ? "Unmute" : "Mute"}>
          {isMicMute ? <MicOff className="size-4" /> : <Mic className="size-4" />}
        </ControlButton>

        <ControlButton active={!isCameraMute} onClick={() => camera.toggle()} label={isCameraMute ? "Turn camera on" : "Turn camera off"}>
          {isCameraMute ? <VideoOff className="size-4" /> : <Video className="size-4" />}
        </ControlButton>

        <ControlButton active={isScreenSharing} onClick={() => screenShare.toggle()} label={isScreenSharing ? "Stop sharing" : "Share screen"}>
          {isScreenSharing ? <ScreenShareOff className="size-4" /> : <ScreenShare className="size-4" />}
        </ControlButton>

        <ControlButton active={showBackgrounds} onClick={() => setShowBackgrounds(true)} label="Backgrounds">
          <Sparkles className="size-4" />
        </ControlButton>

        <ControlButton active={isRecordingActive} onClick={toggleRecording} label={isRecordingActive ? "Stop recording" : "Start recording"}>
          <Circle className={cn("size-3.5", isRecordingActive ? "fill-destructive text-destructive animate-pulse" : "fill-current")} />
        </ControlButton>

        <ControlButton active={showParticipants} onClick={() => setShowParticipants(true)} label="Participants">
          <Users className="size-4" />
        </ControlButton>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full" title="Device settings">
              <Settings className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-72">
            <DeviceSettings />
          </PopoverContent>
        </Popover>

        <ControlButton onClick={() => setShowInfo(true)} label="Meeting info">
          <Info className="size-4" />
        </ControlButton>

        <Button
          variant="destructive"
          size="icon"
          className="rounded-full"
          onClick={() => setShowLeaveAlert(true)}
          title="Leave meeting"
        >
          <PhoneOff className="size-4" />
        </Button>
      </div>

      {showParticipants && <ParticipantsPanel onClose={() => setShowParticipants(false)} />}

      <Sheet open={showBackgrounds} onOpenChange={setShowBackgrounds}>
        <SheetContent className="p-0 w-full sm:max-w-sm">
          <SheetTitle className="sr-only">Virtual backgrounds</SheetTitle>
          <ImageSidebar
            blurLevel={blurLevel}
            setOpen={setShowBackgrounds}
            setBlurLevel={setBlurLevel}
            selectedBackground={selectedBackground}
            setSelectedBackground={setSelectedBackground}
          />
        </SheetContent>
      </Sheet>

      <MeetingInfoModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        meetingUrl={meetingUrl}
      />

      <MeetingLeaveModal
        showLeaveAlert={showLeaveAlert}
        setShowLeaveAlert={setShowLeaveAlert}
      />
    </>
  );
};

const ControlButton = ({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) => (
  <Button
    variant={active ? "default" : "secondary"}
    size="icon"
    className="rounded-full"
    onClick={onClick}
    title={label}
  >
    {children}
  </Button>
);

export default CallControls;

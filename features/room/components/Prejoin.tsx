"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '@/components/logo';
import { useCallStateHooks, VideoPreview } from '@stream-io/video-react-sdk';
import ParticipantPlaceholder from './participant-placeholder';
import RequestPermissionPlaceholder from './request-permission-placeholder';
import { Button } from '@/components/ui/button';
import { useStreamCall } from '../hooks/use-stream-call';
import { toast } from 'sonner';
import { AlertTriangle, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import CustomDeviceSelectorVideo from './custom-device-selector-video';
import CustomDeviceSelectorAudio from './custom-device-selector-audio';
import CustomDeviceSelectorAudioOutput from './custom-device-selector-audio-output';

interface Props {
  setIsSetupComplete: (value: boolean) => void;
}

const Prejoin = ({ setIsSetupComplete }: Props) => {
  const call = useStreamCall();
  const { useMicrophoneState, useCameraState, useParticipantCount } = useCallStateHooks();

  const microphoneState = useMicrophoneState();
  const cameraState = useCameraState();
  const participantCount = useParticipantCount();

  const [microphoneEnabled, setMicrophoneEnabled] = useState(
    microphoneState.isEnabled && microphoneState.hasBrowserPermission
  );
  const [cameraEnabled, setCameraEnabled] = useState(
    cameraState.isEnabled && cameraState.hasBrowserPermission
  );
  const [isJoining, setIsJoining] = useState(false);

  React.useEffect(() => {
    setMicrophoneEnabled(microphoneState.isEnabled && microphoneState.hasBrowserPermission);
  }, [microphoneState.isEnabled, microphoneState.hasBrowserPermission]);
  React.useEffect(() => {
    setCameraEnabled(cameraState.isEnabled && cameraState.hasBrowserPermission);
  }, [cameraState.isEnabled, cameraState.hasBrowserPermission]);

  const requestMicrophonePermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneEnabled(!microphoneEnabled);
    } catch {
      toast.error('Microphone access is required to join the call. Please grant permission to continue.');
    }
  };

  const requestCameraPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraEnabled(!cameraEnabled);
    } catch {
      toast.error('Camera access is required to join the call. Please grant permission to continue.');
    }
  };

  const toggleMicrophone = () => {
    if (microphoneState.hasBrowserPermission) {
      if (microphoneEnabled) {
        call.microphone.disable();
      } else {
        call.microphone.enable();
      }
      setMicrophoneEnabled(!microphoneEnabled);
    } else {
      requestMicrophonePermissions();
    }
  };

  const toggleCamera = () => {
    if (cameraState.hasBrowserPermission) {
      if (cameraEnabled) {
        call.camera.disable();
      } else {
        call.camera.enable();
      }
      setCameraEnabled(!cameraEnabled);
    } else {
      requestCameraPermissions();
    }
  };

  const getButtonVariant = (isEnable: boolean, hasPermission: boolean) => {
    if (!hasPermission) return 'destructive';
    if (!isEnable) return 'destructive';
    return 'secondary';
  };

  return (
    <motion.div
      className="flex flex-col w-full h-full min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full sticky top-0 inset-x-0 px-4 py-4 backdrop-blur-md bg-background/60 z-50">
        <Logo />
      </div>
      <div className="w-full h-full flex-1 flex flex-col lg:flex-row mx-auto max-w-screen-xl px-4 mb-8 gap-8">
        <motion.div
          className="w-full lg:w-2/3 h-full flex flex-col justify-center"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="w-full max-w-3xl relative aspect-video min-h-[360px]">
            <VideoPreview
              className="w-full h-full border border-border bg-black rounded-xl overflow-hidden"
              DisabledVideoPreview={ParticipantPlaceholder}
              NoCameraPreview={RequestPermissionPlaceholder}
            />
            <div className="flex gap-x-4 absolute left-1/2 -translate-x-1/2 bottom-4">
              <div className="relative">
                <Button
                  variant={getButtonVariant(microphoneEnabled, microphoneState.hasBrowserPermission)}
                  className="size-12 sm:size-14 rounded-full"
                  onClick={toggleMicrophone}
                >
                  {microphoneEnabled ? (
                    <Mic className="size-5 sm:size-6" />
                  ) : (
                    <MicOff className="size-5 sm:size-6" />
                  )}
                </Button>
                <AnimatePresence>
                  {!microphoneState.hasBrowserPermission && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground size-6 flex items-center justify-center rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <AlertTriangle className="size-3" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative">
                <Button
                  variant={getButtonVariant(cameraEnabled, cameraState.hasBrowserPermission)}
                  className="size-12 sm:size-14 rounded-full"
                  onClick={toggleCamera}
                >
                  {cameraEnabled ? (
                    <Video className="size-5 sm:size-6" />
                  ) : (
                    <VideoOff className="size-5 sm:size-6" />
                  )}
                </Button>
                <AnimatePresence>
                  {!cameraState.hasBrowserPermission && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground size-6 flex items-center justify-center rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <AlertTriangle className="size-3" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="w-full max-w-3xl gap-4 p-4 flex flex-wrap">
            {cameraState.hasBrowserPermission && (
              <div className="flex-1 min-w-[160px]">
                <CustomDeviceSelectorVideo disabled={false} />
              </div>
            )}
            {microphoneState.hasBrowserPermission && (
              <div className="flex-1 min-w-[160px]">
                <CustomDeviceSelectorAudio disabled={false} />
              </div>
            )}
            {microphoneState.hasBrowserPermission && (
              <div className="flex-1 min-w-[160px]">
                <CustomDeviceSelectorAudioOutput disabled={false} />
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-center space-y-4 lg:w-1/3 lg:self-center mt-4 lg:mt-0 text-center"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="font-medium text-2xl sm:text-3xl">
            Ready to join?
          </h1>
          <p className="text-muted-foreground" key={participantCount}>
            {participantCount > 0
              ? `${participantCount} ${participantCount === 1 ? 'person is' : 'people are'} already here`
              : "You'll be the first one here"}
          </p>
          <Button
            size="lg"
            disabled={isJoining || !microphoneState.hasBrowserPermission || !cameraState.hasBrowserPermission}
            onClick={async () => {
              setIsJoining(true);
              try {
                await call.join();
                setIsSetupComplete(true);
              } catch {
                toast.error('Failed to join the call. Please check your permissions and try again.');
              } finally {
                setIsJoining(false);
              }
            }}
          >
            {isJoining ? 'Joining…' : 'Join call'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Prejoin;

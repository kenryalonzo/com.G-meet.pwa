"use client";

import React, { use, useState, useEffect } from 'react'
import { useGetCall } from '@/features/room/hooks/use-get-call'
import {
  BackgroundFiltersProvider,
  StreamCall,
  StreamTheme,
  useCallStateHooks
} from '@stream-io/video-react-sdk'
import Unauthorized from '@/features/room/components/Unauthorized';
import Prejoin from '@/features/room/components/Prejoin';
import { images } from '@/features/room/lib/utils';
import Room from '@/features/room/components/Room';
import Loading from '@/features/room/components/Loading';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CallControls from '@/features/room/components/call-controls';

interface Props {
  params: Promise<{
    roomName: string
  }>
}

const Page = ({ params }: Props) => {
  const { roomName } = use(params);
  const { isLoading, call } = useGetCall({ roomName });
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    if (!isLoading && !call) {
      toast.error('Meeting not found or expired');
    }
  }, [isLoading, call]);

  if (isLoading) {
    return <Loading title="Preparing your meeting room…" />;
  }

  if (!call) return <Unauthorized />;

  return (
    <StreamCall call={call}>
      <StreamTheme className="w-full h-full">
        {!isSetupComplete ? (
          <Prejoin setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )}
      </StreamTheme>
    </StreamCall>
  );
};

const MeetingRoom = () => {
  const router = useRouter();
  const { useCallEndedAt } = useCallStateHooks();
  const callEndedAt = useCallEndedAt();

  useEffect(() => {
    if (callEndedAt) {
      toast.info('The meeting has ended');
      router.push('/dashboard');
    }
  }, [callEndedAt, router]);

  return (
    <BackgroundFiltersProvider
      backgroundBlurLevel={8}
      backgroundImages={images}
    >
      <div className="relative w-full h-full bg-background">
        <Room />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
          <CallControls />
        </div>
      </div>
    </BackgroundFiltersProvider>
  );
};

export default Page;

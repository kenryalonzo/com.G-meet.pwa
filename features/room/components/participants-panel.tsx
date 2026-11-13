"use client";

import React from 'react';
import { 
  useCall, 
  useCallStateHooks,
  StreamVideoParticipant
} from '@stream-io/video-react-sdk';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  ScreenShare,
  Crown
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import useCurrentUser from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';

interface ParticipantsPanelProps {
  onClose: () => void;
}

interface ParticipantItemProps {
  participant: StreamVideoParticipant;
  ownerId?: string;
  isLocalParticipant: boolean;
}

const ParticipantItem = ({ 
  participant, 
  ownerId,
  isLocalParticipant
}: ParticipantItemProps) => {
  // Vérification directe des pistes publiées
  const isAudioEnabled = participant.publishedTracks.includes(0); // 0 = audio
  const isVideoEnabled = participant.publishedTracks.includes(1); // 1 = video
  
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors">
      <div className="relative">
        <Avatar className='size-12'>
          <AvatarImage
            src={participant.image || undefined}
          />
          <AvatarFallback className='text-foreground text-lg font-medium bg-primary/15'>
            {participant.name?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>

        {participant.userId === ownerId && (
          <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
            <Crown className="size-3 text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {participant.name || 'Anonymous'}
          {isLocalParticipant && (
            <span className="ml-2 text-xs text-primary">(You)</span>
          )}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {participant.userId}
        </p>
      </div>

      <div className="flex gap-2">
        <div className={cn(
          "p-1 rounded-full",
          isAudioEnabled ? "text-live bg-live/15" : "text-muted-foreground"
        )}>
          {isAudioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
        </div>
        <div className={cn(
          "p-1 rounded-full",
          isVideoEnabled ? "text-live bg-live/15" : "text-muted-foreground"
        )}>
          {isVideoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
        </div>
        {participant.publishedTracks.includes(2) && ( // 2 = screen_share
          <div className="p-1 rounded-full text-primary bg-primary/15">
            <ScreenShare size={16} />
          </div>
        )}
      </div>
    </div>
  );
};

export const ParticipantsPanel = ({ onClose }: ParticipantsPanelProps) => {
  const call = useCall();
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const currentUser = useCurrentUser();
  
  // Vérifions si l'utilisateur actuel est le propriétaire de la réunion
  const ownerId = call?.state.createdBy?.id;
  const isOwner = ownerId === currentUser?.id;
  
  // Trions les participants : propriétaire d'abord, puis vous, puis les autres
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.userId === ownerId) return -1;
    if (b.userId === ownerId) return 1;
    if (a.isLocalParticipant) return -1;
    if (b.isLocalParticipant) return 1;
    return 0;
  });
  
  // Fonction pour expulser un participant
  const kickParticipant = (userId: string) => {
    call?.blockUser(userId)
      .then(() => console.log(`Participant ${userId} removed`))
      .catch((err: unknown) => console.error('Failed to remove participant', err));
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-xl z-[100] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold">Participants ({participants.length})</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close participants panel"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {participants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No other participants in the meeting
          </div>
        ) : (
          <div className="space-y-2">
            {sortedParticipants.map((participant) => (
              <div key={participant.sessionId} className="group relative">
                <ParticipantItem 
                  participant={participant}
                  ownerId={ownerId}
                  isLocalParticipant={!!participant.isLocalParticipant}
                />
                
                {isOwner && !participant.isLocalParticipant && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => kickParticipant(participant.userId)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <Avatar className='size-12'>
            <AvatarImage
              src={currentUser?.image || undefined}
            />
            <AvatarFallback className='text-foreground text-lg font-medium bg-primary/15'>
              {currentUser?.name?.charAt(0).toUpperCase() || 'Y'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="font-medium">
              {currentUser?.name || 'You'}
              <span className="ml-2 text-xs text-primary">(You)</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Meeting {isOwner ? 'owner' : 'participant'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
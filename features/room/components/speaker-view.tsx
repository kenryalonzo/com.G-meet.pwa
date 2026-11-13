"use client";

import {
    DefaultParticipantViewUI,
    hasScreenShare,
    ParticipantView,
    useCall,
    useCallStateHooks,
} from '@stream-io/video-react-sdk';

const SpeakerView = () => {
    const call = useCall();
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();
    const [participantInSpotlight, ...otherParticipants] = participants;
    const isOneToOneCall = otherParticipants.length === 1;

    if (!call) {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center text-muted-foreground">
                <span>Connecting to the meeting…</span>
            </div>
        );
    }

    if (participants.length === 0) {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center text-muted-foreground">
                <span>Waiting for other participants…</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full p-4">
            {isOneToOneCall && participants.length >= 2 ? (
                <div className="flex-1 flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 flex items-center justify-center">
                        {participantInSpotlight && (
                            <ParticipantView
                                participant={participantInSpotlight}
                                trackType={hasScreenShare(participantInSpotlight) ? 'screenShareTrack' : 'videoTrack'}
                                ParticipantViewUI={DefaultParticipantViewUI}
                            />
                        )}
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        {otherParticipants[0] && (
                            <ParticipantView
                                participant={otherParticipants[0]}
                                trackType={hasScreenShare(otherParticipants[0]) ? 'screenShareTrack' : 'videoTrack'}
                                ParticipantViewUI={DefaultParticipantViewUI}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {otherParticipants.length > 0 && (
                        <div className="flex flex-row items-center gap-2.5 h-48 min-h-48 overflow-x-auto scrollbar-hide">
                            {otherParticipants.map((participant) => (
                                <div className="w-60 min-w-[240px] first:ml-auto last:mr-auto" key={participant.sessionId}>
                                    <ParticipantView
                                        participant={participant}
                                        trackType={hasScreenShare(participant) ? 'screenShareTrack' : 'videoTrack'}
                                        ParticipantViewUI={DefaultParticipantViewUI}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex-1 flex items-center justify-center min-h-0 mt-4">
                        {participantInSpotlight && (
                            <ParticipantView
                                participant={participantInSpotlight}
                                trackType={hasScreenShare(participantInSpotlight) ? 'screenShareTrack' : 'videoTrack'}
                                ParticipantViewUI={DefaultParticipantViewUI}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default SpeakerView

import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Props {
    roomName: string;
}

export function useGetCall({ roomName }: Props) {

    const [isLoading, setIsLoading] = useState(true);
    const [call, setCall] = useState<Call | undefined>(undefined);
    const client = useStreamVideoClient();

    useEffect(() => {
        if(!client) return;

        const getCall = async () => {
            try {
                const { calls } = await client.queryCalls({
                    filter_conditions: { 
                        id: roomName 
                    },
                });

                if (calls.length > 0) {
                    setCall(calls[0]);
                } else {
                    toast.error(`No call found with room name: ${roomName}`);
                    console.warn(`No call found with room name: ${roomName}`);
                }
            } catch (error) {
                console.error("Error fetching call:", error);
            } finally {
                setIsLoading(false);
            }
        }

        getCall();
    }, [client, roomName]);

    return { isLoading, call };
}
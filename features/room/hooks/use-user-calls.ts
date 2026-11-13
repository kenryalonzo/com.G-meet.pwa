import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useState } from "react";

interface Props {
  userId?: string | null;
}

export function useUserCalls({ userId }: Props) {
  const client = useStreamVideoClient();
  const [isLoading, setIsLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<Call[]>([]);
  const [recent, setRecent] = useState<Call[]>([]);

  const refresh = useCallback(async () => {
    if (!client || !userId) return;

    try {
      setIsLoading(true);
      const { calls } = await client.queryCalls({
        filter_conditions: { created_by_user_id: userId },
        sort: [{ field: "starts_at", direction: -1 }],
        limit: 25,
        watch: false,
      });

      const nextUpcoming: Call[] = [];
      const nextRecent: Call[] = [];

      for (const call of calls) {
        const endedAt = call.state.endedAt;

        if (!endedAt) {
          nextUpcoming.push(call);
        } else {
          nextRecent.push(call);
        }
      }

      nextUpcoming.sort((a, b) => {
        const aTime = a.state.startsAt ? new Date(a.state.startsAt).getTime() : 0;
        const bTime = b.state.startsAt ? new Date(b.state.startsAt).getTime() : 0;
        return aTime - bTime;
      });

      setUpcoming(nextUpcoming);
      setRecent(nextRecent.slice(0, 8));
    } catch (error) {
      console.error("Failed to load meetings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [client, userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { isLoading, upcoming, recent, refresh };
}

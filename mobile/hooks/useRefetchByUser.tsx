import { useState } from "react";
import { useGetEvents, useGetResources, useGetTeam } from "./query";

export function useRefetchByUser() {
  const { refetch: refetchEvents } = useGetEvents();
  const { refetch: refetchTeam } = useGetTeam();
  const { refetch: refetchResources } = useGetResources();

  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false);

  const refetchByUser = async () => {
    setIsRefetchingByUser(true);

    try {
      await Promise.allSettled([
        refetchEvents(),
        refetchTeam(),
        refetchResources(),
      ]);
    } catch (error) {
      console.error('useRefetchByUser -> Could not refetch by user...', error.message)
      throw error;
    } finally {
      setIsRefetchingByUser(false);
    }
  }

  return {
    isRefetchingByUser,
    refetchByUser,
  };
}

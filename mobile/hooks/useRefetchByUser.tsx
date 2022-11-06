import { useState } from "react";
import { useGetEvents, useGetTeam } from "./query";

export function useRefetchByUser() {
  const { refetch: refetchEvents } = useGetEvents();
  const { refetch: refetchTeam } = useGetTeam();

  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false);

  const refetchByUser = async () => {
    setIsRefetchingByUser(true);

    try {
      await Promise.allSettled([
        refetchEvents(),
        refetchTeam(),
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

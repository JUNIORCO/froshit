import { useState } from "react";
import { useGetEvents, useGetOffers, useGetResources, useGetTeam } from "./query";

export function useRefetchByUser() {
  const { refetch: refetchEvents } = useGetEvents();
  const { refetch: refetchTeam } = useGetTeam();
  const { refetch: refetchResources } = useGetResources();
  const { refetch: refetchOffers } = useGetOffers();

  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false);

  const refetchByUser = async () => {
    setIsRefetchingByUser(true);

    await Promise.allSettled([
      refetchEvents(),
      refetchTeam(),
      refetchResources(),
      refetchOffers(),
    ]);

    setIsRefetchingByUser(false);
  }

  return {
    isRefetchingByUser,
    refetchByUser,
  };
}

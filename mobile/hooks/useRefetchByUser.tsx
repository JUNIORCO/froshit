import { useState } from "react";
import { useGetEvents, useGetOffers, useGetResources, useGetTeam } from "./query";
import AsyncStorage from '@react-native-async-storage/async-storage';
import QueryKeys from "./query/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";

export function useRefetchByUser() {
  const queryClient = useQueryClient()

  const { refetch: refetchEvents } = useGetEvents();
  const { refetch: refetchTeam } = useGetTeam();
  const { refetch: refetchResources } = useGetResources();
  const { refetch: refetchOffers } = useGetOffers();

  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false);

  const refetchByUser = async () => {
    setIsRefetchingByUser(true);

    await queryClient.clear();

    for (const queryKey in QueryKeys) {
      await AsyncStorage.removeItem(queryKey);
    }

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

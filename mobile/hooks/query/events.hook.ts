import { useQuery } from "@tanstack/react-query";
import QueryKeys from "./QueryKeys";
import { fetchEvents } from "../../api/events";
import useSession from "../useSession";

export const useGetEvents = () => {
  const { profile } = useSession();
  const froshId = profile!.froshId;
  return useQuery({ queryKey: [QueryKeys.EVENTS, { froshId }], queryFn: fetchEvents })
};

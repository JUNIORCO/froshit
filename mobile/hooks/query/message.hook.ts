import { useQuery } from "@tanstack/react-query";
import QueryKeys from "../../@types/QueryKeys";
import useSession from "../useSession";
import { fetchMessages } from "../../api/messages";

export const useGetMessages = () => {
  const { profile } = useSession();
  const teamId = profile!.teamId;
  return useQuery({ queryKey: [QueryKeys.MESSAGES, { teamId }], queryFn: fetchMessages })
};

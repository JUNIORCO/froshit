import { useQuery } from "@tanstack/react-query";
import QueryKeys from "./QueryKeys";
import { fetchTeam } from "../../api/team";
import useSession from "../useSession";

export const useGetTeam = () => {
  const { profile } = useSession();
  const teamId = profile!.teamId;
  return useQuery({ queryKey: [QueryKeys.TEAM, { teamId }], queryFn: fetchTeam })
};

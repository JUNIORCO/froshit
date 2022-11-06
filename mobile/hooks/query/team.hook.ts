import { useQuery } from "@tanstack/react-query";
import QueryKeys from "./QueryKeys";
import { fetchTeam } from "../../api/team";

export const useGetTeam = () => useQuery({ queryKey: [QueryKeys.TEAM], queryFn: fetchTeam });

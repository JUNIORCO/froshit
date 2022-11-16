import { useQuery } from "@tanstack/react-query";
import QueryKeys from "./QueryKeys";
import { fetchTeam } from "../../api/team";

export const useGetTeam = () => useQuery({ queryKey: [QueryKeys.TEAM, { id: 'b3c4a208-52fc-4064-a43a-0c85be2ce42f' }], queryFn: fetchTeam });

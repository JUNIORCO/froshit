import { QueryFunctionContext } from "@tanstack/react-query";
import { db } from "../supabase/db";

type QueryKeyArg = {
  teamId: string;
}

export const fetchTeam = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>) => {
  const [_key, { teamId }] = queryKey;

  const { data: teamMembers, error: getTeamMembersError } = await db.team.getTeamMembers(teamId);

  if (getTeamMembersError) throw getTeamMembersError;

  return teamMembers;
}

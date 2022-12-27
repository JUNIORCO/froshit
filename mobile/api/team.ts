import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";
import type { QueryKey } from "@tanstack/react-query";
import { QueryFunctionContext } from "@tanstack/react-query";

type QueryKeyArg = {
  teamId: string;
}

export const fetchTeam = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>): Promise<any> => {
  const [_key, { teamId }] = queryKey;
  console.log(`api -> Fetching team ${teamId}`)
  const {
    data: team,
    error
  } = await supabase
    .from(Tables.PROFILE)
    .select('*, teamId (name)')
    .eq('teamId', teamId)
    .order('firstName', { ascending: true });

  if (error) {
    console.error(`fetchTeam -> ${error.message}`);
    throw error;
  }

  return team;
}

import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";
import type { QueryKey } from "@tanstack/react-query";

export const fetchTeam = async ({ queryKey }: QueryKey): Promise<any> => {
  const [_key, { id }] = queryKey;
  console.log(`api -> Fetching team ${id}`)
  const {
    data: team,
    error
  } = await supabase
    .from(Tables.PROFILE)
    .select('id, role, name, phoneNumber, interests, programId (name), teamId (name)')
    .eq('teamId', id)
    .order('name', { ascending: true });

  if (error) {
    console.error(`fetchTeam -> ${error.message}`);
    throw error;
  }

  return team;
}

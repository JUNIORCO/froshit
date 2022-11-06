import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";

export const fetchTeam = async (): Promise<any> => {
  console.log('api -> Fetching team...')
  const { data: events, error } = await supabase.from(Tables.TEAM).select('*');

  if (error) {
    console.error(`fetchTeam -> ${error.message}`);
    throw error;
  }

  return events;
}

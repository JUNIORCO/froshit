import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";

export const fetchOffers = async (): Promise<any> => {
  console.log('api -> Fetching offers...')
  const { data: events, error } = await supabase.from(Tables.OFFER).select('*');

  if (error) {
    console.error(`fetchTeam -> ${error.message}`);
    throw error;
  }

  return events;
}

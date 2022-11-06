import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";

export const fetchResources = async (): Promise<any> => {
  console.log('api -> Fetching resources...')
  const { data: events, error } = await supabase.from(Tables.RESOURCE).select('*');

  if (error) {
    console.error(`fetchResources -> ${error.message}`);
    throw error;
  }

  return events;
}

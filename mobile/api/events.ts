import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";

export const fetchEvents = async (): Promise<any> => {
  console.log('api -> Fetching events...')
  const { data: events, error } = await supabase.from(Tables.EVENT).select('*');

  if (error) {
    console.error(`fetchEvents -> ${error.message}`);
    throw error;
  }

  return events;
}

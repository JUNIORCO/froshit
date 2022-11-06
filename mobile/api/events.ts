import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";

export const fetchEvents = async (): Promise<any> => {
  console.log('api -> Fetching events...')
  const { data: events, error } = await supabase
    .from(Tables.EVENT)
    .select('*')
    .order('startDate', { ascending: true });

  if (error) {
    console.error(`api -> fetchEvents errored ${error.message}`);
    throw error;
  }

  return events;
}

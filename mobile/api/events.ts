import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";
import { QueryFunctionContext } from "@tanstack/react-query";

type QueryKeyArg = {
  froshId: string;
}

export const fetchEvents = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>): Promise<any> => {
  const [_key, { froshId }] = queryKey;
  console.log('api -> Fetching events...')
  const { data: events, error } = await supabase
    .from(Tables.EVENT)
    .select('*')
    .eq('froshId', froshId)
    .order('startDate', { ascending: true });

  if (error) {
    console.error(`api -> fetchEvents errored ${error.message}`);
    throw error;
  }

  return events;
}

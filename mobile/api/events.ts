import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";
import { QueryFunctionContext } from "@tanstack/react-query";

type QueryKeyArg = {
  froshId: string;
}

export const fetchEvents = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>): Promise<any> => {
  const [_key, { froshId }] = queryKey;
  console.log('api -> Fetching events...')
  const { data: eventFroshMapping, error: eventFroshMappingError } = await supabase
    .from('_EventToFrosh')
    .select('*')
    .eq('B', froshId);

  if (!eventFroshMapping || eventFroshMappingError) throw eventFroshMappingError;

  if (!eventFroshMapping.length) return [];

  const { data: events, error: eventsError } = await supabase
    .from(Tables.EVENT)
    .select('*')
    .in('id', eventFroshMapping.map(mapping => mapping.A))
    .order('startDate', { ascending: true });

  if (eventsError) {
    console.error(`api -> fetchEvents errored ${eventsError.message}`);
    throw eventsError;
  }

  return events;
}

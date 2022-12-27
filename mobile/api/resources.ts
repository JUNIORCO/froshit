import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";
import { QueryFunctionContext } from "@tanstack/react-query";

type QueryKeyArg = {
  universityId: string;
}

export const fetchResources = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>): Promise<any> => {
  const [_key, { universityId }] = queryKey;
  console.log(`api -> Fetching resources for university ${universityId}`)
  // @ts-ignore
  const { data: events, error } = await supabase
    .from(Tables.RESOURCE)
    .select('*, resourceTagId (id, name, imageUrl)')
    .eq('universityId', universityId);

  if (error) {
    console.error(`fetchResources -> ${error.message}`);
    throw error;
  }

  return events;
}

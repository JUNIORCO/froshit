import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";
import { QueryFunctionContext } from "@tanstack/react-query";

type QueryKeyArg = {
  universityId: string;
}

export const fetchOffers = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>): Promise<any> => {
  const [_key, { universityId }] = queryKey;
  console.log(`api -> Fetching offers for university ${universityId}`)
  const {
    data: offers,
    error
  } = await supabase
    .from(Tables.OFFER)
    .select('*')
    .eq('universityId', universityId)
    .order('provider', { ascending: true });

  if (error) {
    console.error(`fetchOffers -> ${error.message}`);
    throw error;
  }

  return offers;
}

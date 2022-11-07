import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";
import type { QueryKey } from "@tanstack/react-query";

export const fetchOffers = async ({ queryKey }: QueryKey): Promise<any> => {
  const [_key, { id }] = queryKey;
  console.log(`api -> Fetching offers for university ${id}`)
  const {
    data: offers,
    error
  } = await supabase
    .from(Tables.OFFER)
    .select('id, title, description, icon, provider, colour')
    .eq('universityId', id)
    .order('provider', { ascending: true });

  if (error) {
    console.error(`fetchOffers -> ${error.message}`);
    throw error;
  }

  return offers;
}

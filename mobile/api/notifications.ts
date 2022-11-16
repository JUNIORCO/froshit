import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";
import type { QueryKey } from "@tanstack/react-query";

export const fetchNotifications = async ({ queryKey }: QueryKey): Promise<any> => {
  const [_key, { id }] = queryKey;
  console.log(`api -> Fetching notifications for user ${id}`)
  const {
    data: notifications,
    error
  } = await supabase
    .from(Tables.OFFER)
    .select('*')
    .eq('universityId', id)
    .order('provider', { ascending: true });

  if (error) {
    console.error(`fetchOffers -> ${error.message}`);
    throw error;
  }

  return notifications;
}

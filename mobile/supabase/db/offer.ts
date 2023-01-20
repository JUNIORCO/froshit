import { supabase } from "../supabase";
import { Offer, Tables } from "../extended.types";

export class _Offer {
  public static getOffersByUniversityId = async (universityId: string) =>
    supabase.from<typeof Tables.offer, Offer>(Tables.offer)
      .select('*')
      .eq('universityId', universityId)
      .order('provider', { ascending: true });
}

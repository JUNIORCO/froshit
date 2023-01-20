import { QueryFunctionContext } from "@tanstack/react-query";
import { db } from "../supabase/db";

type QueryKeyArg = {
  universityId: string;
}

export const fetchOffers = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>) => {
  const [_key, { universityId }] = queryKey;

  const { data: offers, error: getOffersError } = await db.offer.getOffersByUniversityId(universityId);

  if (getOffersError) throw getOffersError;

  return offers;
}

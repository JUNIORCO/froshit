import { useQuery } from "@tanstack/react-query";
import QueryKeys from "./QueryKeys";
import { fetchOffers } from "../../api/offers";

export const useGetOffers = () => useQuery({
  queryKey: [QueryKeys.OFFERS, { id: '1678f7bf-7a13-477c-942c-c85dcadfdd40' }],
  queryFn: fetchOffers
});

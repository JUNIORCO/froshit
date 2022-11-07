import { useQuery } from "@tanstack/react-query";
import QueryKeys from "./QueryKeys";
import { fetchOffers } from "../../api/offers";

export const useGetOffers = () => useQuery({ queryKey: [QueryKeys.OFFERS, { id: 1 }], queryFn: fetchOffers });

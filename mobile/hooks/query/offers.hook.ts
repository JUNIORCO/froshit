import { useQuery } from "@tanstack/react-query";
import QueryKeys from "./QueryKeys";
import { fetchOffers } from "../../api/offers";
import useSession from "../useSession";

export const useGetOffers = () => {
  const { profile } = useSession();
  const universityId = profile.universityId;
  return useQuery({
    queryKey: [QueryKeys.OFFERS, { universityId }],
    queryFn: fetchOffers
  })
};

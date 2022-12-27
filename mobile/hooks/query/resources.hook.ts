import { useQuery } from "@tanstack/react-query";
import QueryKeys from "../../@types/QueryKeys";
import { fetchResources } from "../../api/resources";
import useSession from "../useSession";

export const useGetResources = () => {
  const { profile } = useSession();
  const universityId = profile!.universityId;
  return useQuery({ queryKey: [QueryKeys.RESOURCES, { universityId }], queryFn: fetchResources })
};

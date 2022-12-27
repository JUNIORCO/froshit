import { useQuery } from "@tanstack/react-query";
import QueryKeys from "../../@types/QueryKeys";
import { fetchUniversities } from "../../api/universities";

export const useGetUniversities = () => useQuery({ queryKey: [QueryKeys.UNIVERSITIES], queryFn: fetchUniversities });

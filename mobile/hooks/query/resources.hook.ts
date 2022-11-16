import { useQuery } from "@tanstack/react-query";
import QueryKeys from "./QueryKeys";
import { fetchResources } from "../../api/resources";

export const useGetResources = () => useQuery({ queryKey: [QueryKeys.RESOURCES, { id: 'b3c4a208-52fc-4064-a43a-0c85be2ce42f' }], queryFn: fetchResources });

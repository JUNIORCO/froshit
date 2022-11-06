import { useQuery } from "@tanstack/react-query";
import QueryKeys from "./QueryKeys";
import { fetchEvents } from "../../api/events";

export const useGetEvents = () => useQuery({ queryKey: [QueryKeys.EVENTS], queryFn: fetchEvents });

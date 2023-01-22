import { QueryFunctionContext } from "@tanstack/react-query";
import { db } from "../supabase/db";
import { eventFormatter } from "../helpers/eventFormatter";

type QueryKeyArg = {
  froshId: string;
}

export const fetchEvents = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>) => {
  const [_key, { froshId }] = queryKey;

  const { data: eventFroshMapping, error: eventFroshMappingError } = await db.event.getEventFroshMappings(froshId);

  if (!eventFroshMapping || eventFroshMappingError) throw eventFroshMappingError;

  if (!eventFroshMapping.length) return [];

  const eventIds = eventFroshMapping.map(mapping => mapping.A);
  const { data: events, error: eventsError } = await db.event.getEvents(eventIds);

  if (eventsError) throw eventsError;

  return events.map(eventFormatter);
}

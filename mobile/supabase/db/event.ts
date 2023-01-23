import { supabase } from "../supabase";
import { _EventToFrosh, Event, Tables } from "../types/extended";

export class _Event {
  public static getEventFroshMappings = async (froshId: string) =>
    supabase.from<typeof Tables._EventToFrosh, _EventToFrosh>(Tables._EventToFrosh)
      .select('*')
      .eq('B', froshId);

  public static getEvents = async (eventIds: string[]) =>
    supabase.from<typeof Tables.event, Event>(Tables.event)
      .select(`*`)
      .in('id', eventIds)
      .order('startDate', { ascending: true });
}


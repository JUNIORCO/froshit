import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import { TABLES } from "../supabase/columns";

export enum FetchEventsStatus {
  Loading = "LOADING",
  Fetched = "FETCHED",
  Errored = "ERRORED",
}

enum AsyncStorageKeys {
  UserFavoriteCountry = "UserFavoriteCountry",
}

export interface UseEventContext {
  events: any;
  eventStatus: FetchEventsStatus;
}

/**
 * Get and save user favorite information.
 *
 * @export
 * @returns {UseEventContext}
 */
export function useEvents(): UseEventContext {
  // const setEvents = useCallback(async (params) => {
  //   console.log('call back running with params ', params)
  //   // await AsyncStorage.setItem(AsyncStorageKeys.UserFavoriteCountry, countryCode);
  //   setEventsCtx(prev => ({
  //     ...prev,
  //     eventStatus: FetchEventsStatus.Fetched,
  //   }));
  // }, []);

  const [eventsCtx, setEventsCtx] = useState<UseEventContext>({
    events: null,
    eventStatus: FetchEventsStatus.Loading,
  });

  // useEffect(() => {
  //   if (eventsCtx.eventStatus === FetchEventsStatus.Fetched && eventsCtx.events) {
  //     setEvents();
  //   }
  // }, [eventsCtx.eventStatus]);

  useEffect(() => {
    async function fetchEvents() {
      const {
        data: events,
        error
      } = await supabase.from(TABLES.Event)
        .select('*')
        .order('startDate', { ascending: true });

      if (error || !events) {
        setEventsCtx(prev => ({
          ...prev,
          eventStatus: FetchEventsStatus.Errored,
        }));
        return;
      }

      setEventsCtx(prev => ({
        ...prev,
        eventStatus: FetchEventsStatus.Fetched,
        events,
      }));
    }

    fetchEvents();
  }, []);

  return eventsCtx;
}

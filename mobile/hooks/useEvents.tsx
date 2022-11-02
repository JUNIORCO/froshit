import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import { TABLES } from "../supabase/columns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

export enum FetchEventsStatus {
  Loading = "LOADING",
  Fetched = "FETCHED",
  Errored = "ERRORED",
}

enum AsyncStorageKeys {
  Events = "Events",
}

export interface UseEventContext {
  events: any;
  eventStatus: FetchEventsStatus | null;
}

/**
 * Get and save user favorite information.
 *
 * @export
 * @returns {UseEventContext}
 */
export function useEvents({ forceFetch }): UseEventContext {
  const cacheEvents = async () => {
    console.log('cacheEvents started... ')

    const cachedEvents = { events: eventsCtx.events, cachedAt: new Date() }

    await AsyncStorage.setItem(AsyncStorageKeys.Events, JSON.stringify(cachedEvents));
  };

  const [eventsCtx, setEventsCtx] = useState<UseEventContext>({
    events: null,
    eventStatus: null,
  });

  async function fetchEvents() {
    console.log('=================================================');
    console.log('fetching events...', forceFetch);
    setEventsCtx(prev => ({
      ...prev,
      eventStatus: FetchEventsStatus.Loading,
    }));

    if (!forceFetch) {
      const cachedItem = await AsyncStorage.getItem(AsyncStorageKeys.Events);
      if (cachedItem) {
        const { events: cachedEvents, cachedAt } = JSON.parse(cachedItem);
        console.log('found ', cachedEvents.length, cachedAt, ' in local storage')

        if (!dayjs(cachedAt).isBefore(dayjs(), 'minutes')) {
          console.log('not old, can use cache');
          setEventsCtx(prev => ({
            ...prev,
            eventStatus: FetchEventsStatus.Fetched,
            events: cachedEvents,
          }));
          return;
        }
        console.log('old cache, refetching');
      }
    }

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

  useEffect(() => {
    console.log('useEvents hook mounted...');
    void fetchEvents();
  }, []);

  useEffect(() => {
    console.log('eventCtx.events got updated...');
    if (eventsCtx.events?.length) {
      void cacheEvents();
    }
  }, [eventsCtx.events]);

  return { eventsCtx, fetchEvents };
}

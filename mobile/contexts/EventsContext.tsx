import { createContext, ReactNode, useEffect, useState } from "react";
import dayjs from "../utils/dayjs";
import { useGetEvents } from "../hooks/query";

export type EventsContextProps = {};

const initialState: EventsContextProps = {};

export const EventsContext = createContext(initialState);

type EventsProviderProps = {
  children: ReactNode;
};

export default function EventsProvider({ children }: EventsProviderProps) {
  const {
    isLoading: eventsIsLoading,
    isError: eventsIsError,
    data: events,
    error: eventsError,
  } = useGetEvents();
  const [filteredEvents, setFilteredEvents] = useState();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    if (selectedDate && events && events.length) {
      setFilteredEvents(events.filter(({ startDate }) => dayjs(startDate).isSame(selectedDate, 'day')))
    }
  }, [events, selectedDate]);

  useEffect(() => {
    if (events && events.length) {
      setStartDate(events[0].startDate);
      setEndDate(events[events.length - 1].startDate);
      setSelectedDate(events[0].startDate); // TODO make today
    }
  }, [events]);

  return (
    <EventsContext.Provider
      value={{
        events,
        eventsIsLoading,
        eventsIsError,
        eventsError,
        selectedDate,
        setSelectedDate,
        filteredEvents,
        setFilteredEvents,
        startDate,
        endDate,
      }}>
      {children}
    </EventsContext.Provider>);
}

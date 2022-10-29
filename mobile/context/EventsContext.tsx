import { createContext, useEffect, useState } from "react";
import { useEvents } from "../hooks/useEvents";
import dayjs from "../utils/dayjs";

export const EventsContext = createContext({
  selectedDate: null,
});

export default function EventsProvider({ children }) {
  const { events } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    if (selectedDate) {
      setFilteredEvents(events.filter(({ startDate }) => dayjs(startDate).isSame(selectedDate, 'day')))
    }
  }, [events, selectedDate]);

  useEffect(() => {
    console.log('events useffect fired ', events && events.length)
    if (events && events.length) {
      setStartDate(events[0].startDate);
      setEndDate(events[events.length - 1].startDate);
      setSelectedDate(events[0].startDate); // TODO make today
    }
  }, [events]);

  return (
    <EventsContext.Provider
      value={{
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

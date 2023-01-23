import { Card } from "react-native-paper";
import Calendar from "../components/events/Calendar/Calendar";
import { commonStyles } from "./styles/Common.styles";
import { useGetEvents } from "../hooks/query";
import { useEffect, useState } from "react";
import dayjs from "../utils/dayjs";
import { getDatesFromEvents } from "../utils/date";
import EventList from "../components/events/EventList/EventList";

export default function EventsScreen() {
  const {
    isLoading: eventsIsLoading,
    isError: eventsIsError,
    data: events,
    error: eventsError,
  } = useGetEvents();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);

  const renderScreen = events && selectedDate;

  useEffect(() => {
    if (events) {
      const dates = getDatesFromEvents(events);
      setCalendarDates(dates);

      const isTodayInDates = dates.find((date) => dayjs(date).isToday());
      const initialSelectedDate = isTodayInDates ?? dates[0];

      setSelectedDate(initialSelectedDate);
    }
  }, [events]);

  return renderScreen ? (
    <Card style={commonStyles.mainCard}>
      <Calendar dates={calendarDates} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
      <EventList events={events} selectedDate={selectedDate}/>
    </Card>
  ) : null;
}

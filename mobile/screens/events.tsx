import { SafeAreaView } from "react-native";
import { useState } from "react";
import Calendar from "../components/events/Calendar/Calendar";
import EventList from "../components/events/EventList/EventList";
import type { Dayjs } from 'dayjs';
import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday';
import { getDatesBetween } from "../utils/date";

dayjs.extend(isToday);

export default function EventsScreen() {
  // calendar stuff
  const startDate = dayjs();
  const endDate = dayjs().add(10, 'days');

  const datesBetween = getDatesBetween({ startDate, endDate })

  const eventDates = datesBetween.map((dayjsDate, id) => {
    const month = dayjsDate.format('MMM');
    const day = dayjsDate.format('D');
    const isToday = dayjsDate.isToday();

    return {
      id,
      month,
      day,
      isToday,
      dayjsDate
    }
  });

  const [selectedDate, setSelectedDate] = useState<Dayjs>(eventDates[0].dayjsDate);

  // event list stuff
  const events = [];

  return (
    <SafeAreaView>
      <Calendar eventDates={eventDates} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
      <EventList events={events}/>
    </SafeAreaView>
  )
}

import EventCard from "./EventCard";
import { Event } from "../../../supabase/extended.types";
import { Fragment } from "react";

type Props = {
  events: Event['Row'][];
}

export default function EventList({ events, selectedDate }: Props) {
  const renderEventCard = (event: Event['Row']) => <EventCard key={event.name} {...event} selectedDate={selectedDate}/>;

  return <Fragment>{events.map(renderEventCard)}</Fragment>;
}

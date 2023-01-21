import Calendar from "../../../components/events/Calendar/Calendar";
import EventList from "../../../components/events/EventList/EventList";
import { Card } from "react-native-paper";

export default function EventsList() {
  return (
    <Card style={{ padding: 16, borderRadius: 16 }}>
      <Calendar/>
      <EventList/>
    </Card>
  );
}

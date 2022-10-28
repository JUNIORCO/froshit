import Calendar from "../components/events/Calendar/Calendar";
import EventList from "../components/events/EventList/EventList";
import { SafeAreaView, StyleSheet } from "react-native";
import EventsProvider from "../context/EventsContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    marginBottom: 0,
  },
});

export default function EventsScreen() {
  return (
    <EventsProvider>
      <SafeAreaView style={styles.container}>
        <Calendar/>
        <EventList/>
      </SafeAreaView>
    </EventsProvider>
  )
}

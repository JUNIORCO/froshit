import { SafeAreaView, StyleSheet, Text } from "react-native";
import EventsProvider from "../../../context/EventsContext";
import React from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    marginBottom: 0,
  },
});

export default function EventDetails({ route, navigation }) {
  const { name, location, startDate, endDate, description, } = route.params;
  return (
    <EventsProvider>
      <SafeAreaView style={styles.container}>
        <Text>event</Text>
        <Text>{name}{location}</Text>
      </SafeAreaView>
    </EventsProvider>
  );
}

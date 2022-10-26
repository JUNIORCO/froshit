import React from 'react';
import { Text, View } from 'react-native';
import { styles } from "./EventList.styles";

export default function EventCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
    </View>
  )
}

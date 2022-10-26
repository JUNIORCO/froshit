import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { styles } from "./EventList.styles";
import ItemSeparatorComponent from "../../common/ItemSeparatorComponent";

export default function EventList({ events }) {
  const renderEventCard = ({ item }) => {

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </View>
  )
}

import React, { useContext } from 'react';
import { FlatList, Text, View } from 'react-native';
import { styles } from "./EventList.styles";
import EventCard from "./EventCard";
import VerticalItemSeparatorComponent from "../../common/VerticalItemSeparatorComponent";
import { EventsContext } from "../../../context/EventsContext";

export default function EventList() {
  const { filteredEvents } = useContext(EventsContext);

  const handleCardClick = (id) => {
    console.log('clicked on card, ', id)
  }

  const renderEventCard = ({ item }) => {
    return <EventCard {...item} handleCardClick={() => handleCardClick(item.id)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <FlatList
        data={filteredEvents}
        showsVerticalScrollIndicator={false}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={VerticalItemSeparatorComponent}
      />
    </View>
  )
}

import React, { useContext } from 'react';
import { FlatList, Text, View } from 'react-native';
import { styles } from "./EventList.styles";
import EventCard from "./EventCard";
import VerticalItemSeparatorComponent from "../../common/VerticalItemSeparatorComponent";
import { EventsContext } from "../../../context/EventsContext";
import { useNavigation } from '@react-navigation/native';

export default function EventList() {
  const navigation = useNavigation();
  const { filteredEvents } = useContext(EventsContext);

  const handleCardClick = (event) => navigation.navigate('Event Details', { ...event });

  const renderEventCard = ({ item: event }) => <EventCard {...event} handleCardClick={() => handleCardClick(event)}/>;

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

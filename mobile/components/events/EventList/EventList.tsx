import React, { useContext } from 'react';
import { FlatList } from 'react-native';
import EventCard from "./EventCard";
import VerticalItemSeparatorComponent from "../../common/VerticalItemSeparatorComponent";
import { EventsContext } from "../../../contexts/EventsContext";
import { useNavigation } from '@react-navigation/native';

export default function EventList() {
  const navigation = useNavigation();

  const { filteredEvents } = useContext(EventsContext);

  const handleCardClick = (event) => navigation.navigate('Event Details' as any, event);

  const renderEventCard = ({ item: event }) => <EventCard {...event} handleCardClick={() => handleCardClick(event)}/>;

  return (
    <FlatList
      scrollEnabled={false}
      data={filteredEvents}
      showsVerticalScrollIndicator={false}
      renderItem={renderEventCard}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={VerticalItemSeparatorComponent}
    />
  )
}

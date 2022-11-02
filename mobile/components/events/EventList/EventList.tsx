import React, { useContext } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { styles } from "./EventList.styles";
import EventCard from "./EventCard";
import VerticalItemSeparatorComponent from "../../common/VerticalItemSeparatorComponent";
import { EventsContext } from "../../../context/EventsContext";
import { useNavigation } from '@react-navigation/native';
import { FetchEventsStatus, useEvents } from "../../../hooks/useEvents";

export default function EventList() {
  const navigation = useNavigation();
  const { eventsCtx, fetchEvents } = useEvents({ forceFetch: false });
  const { filteredEvents } = useContext(EventsContext);

  const handleCardClick = (event) => navigation.navigate('Event Details', { ...event });

  const renderEventCard = ({ item: event }) => <EventCard {...event} handleCardClick={() => handleCardClick(event)}/>;
  console.log('eventsCtx.eventStatus : ', eventsCtx.eventStatus)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <FlatList
        data={filteredEvents}
        showsVerticalScrollIndicator={false}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={VerticalItemSeparatorComponent}
        refreshControl={
          <RefreshControl refreshing={eventsCtx.eventStatus === FetchEventsStatus.Loading} onRefresh={fetchEvents} />
        }
      />
    </View>
  )
}

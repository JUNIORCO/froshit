import React, { useContext } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { styles } from "./EventList.styles";
import EventCard from "./EventCard";
import VerticalItemSeparatorComponent from "../../common/VerticalItemSeparatorComponent";
import { EventsContext } from "../../../contexts/EventsContext";
import { useNavigation } from '@react-navigation/native';
import { useRefetchByUser } from "../../../hooks/useRefetchByUser";

export default function EventList() {
  const navigation = useNavigation();

  const { filteredEvents } = useContext(EventsContext);
  const { isRefetchingByUser, refetchByUser } = useRefetchByUser();

  const handleCardClick = (event) => navigation.navigate('Event Details' as any, event);

  const renderEventCard = ({ item: event }) => <EventCard {...event} handleCardClick={() => handleCardClick(event)}/>;

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredEvents}
        showsVerticalScrollIndicator={false}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={VerticalItemSeparatorComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingByUser}
            onRefresh={refetchByUser}
          />
        }
      />
    </View>
  )
}

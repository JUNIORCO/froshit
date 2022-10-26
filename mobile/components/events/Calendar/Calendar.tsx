import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { styles } from "./Calendar.styles";
import ItemSeparatorComponent from "../../common/ItemSeparatorComponent";

export default function Calendar({ eventDates, selectedDate, setSelectedDate }) {
  const handleCalendarPress = (dayjsDate) => setSelectedDate(dayjsDate);

  const isDateSelected = (dayjsDate) => dayjsDate.isSame(selectedDate, 'day');

  const renderCalendarItem = ({ item }) => {
    const { month, day, dayjsDate } = item;

    return (
      <Pressable onPress={() => handleCalendarPress(dayjsDate)}>
        <View style={styles.item(isDateSelected(dayjsDate))}>
          <Text style={styles.title}>{month}</Text>
          <Text style={styles.title}>{day}</Text>
        </View>
      </Pressable>
    )
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={eventDates}
        renderItem={renderCalendarItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </View>
  )
}

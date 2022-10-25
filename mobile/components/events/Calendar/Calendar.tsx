import React from 'react';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import dayjs from "dayjs";
import { getDatesBetween } from "../../../utils/date";
import { styles } from "./Calendar.styles";
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday)

const startDate = dayjs();
const endDate = dayjs().add(10, 'days');

const datesBetween = getDatesBetween({ startDate, endDate })

const eventDates = datesBetween.map((dayjsDate, id) => {
  const month = dayjsDate.format('MMM');
  const day = dayjsDate.format('D');
  const isToday = dayjsDate.isToday();

  return {
    id,
    month,
    day,
    isToday,
  }
});

console.log(eventDates)

export default function Calendar() {
  const handleCalendarPress = ({ id }) => {
    console.log(id)
  }

  const renderCalendarItem = ({ item }) => (
    <Pressable onPress={() => handleCalendarPress({ id: item.id })}>
      <View style={styles.item}>
        <Text style={styles.title}>{item.month}</Text>
        <Text style={styles.title}>{item.day}</Text>
        <Text style={styles.title}>{item.isToday? 'Today!' : 'Future'}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView styles={styles.container}>
      <FlatList data={eventDates} renderItem={renderCalendarItem} keyExtractor={item => item.id} horizontal/>
    </SafeAreaView>
  )
}

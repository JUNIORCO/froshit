import React, { useContext } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { styles } from "./Calendar.styles";
import HorizontalItemSeparatorComponent from "../../common/HorizontalItemSeparatorComponent";
import { EventsContext } from "../../../contexts/EventsContext";
import { getDatesBetween } from "../../../utils/date";
import dayjs from "../../../utils/dayjs";

export default function Calendar() {
  const { selectedDate, setSelectedDate, startDate, endDate } = useContext(EventsContext);

  const froshDates = getDatesBetween({ startDate, endDate });
  const calendarData = froshDates.map((date, index) => ({ date, id: index }));

  const handleCalendarPress = (date) => setSelectedDate(date);

  const isDateSelected = (dayjsDate) => dayjsDate.isSame(selectedDate, 'day');

  const renderCalendarItem = ({ item }) => {
    const { id, date } = item;

    const dayjsDate = dayjs(date);

    return (
      <Pressable onPress={() => handleCalendarPress(date)}>
        <View style={styles.item(isDateSelected(dayjsDate))}>
          <Text style={styles.title}>{dayjsDate.format('MMM')}</Text>
          <Text style={styles.title}>{dayjsDate.format('D')}</Text>
        </View>
      </Pressable>
    )
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={calendarData}
        renderItem={renderCalendarItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={HorizontalItemSeparatorComponent}
      />
    </View>
  )
}

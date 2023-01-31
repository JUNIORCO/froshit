import React, { Dispatch, SetStateAction } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { styles } from "./Calendar.styles";
import HorizontalItemSeparatorComponent from "../../common/HorizontalItemSeparatorComponent";
import dayjs from "../../../utils/dayjs";
import { Text } from 'react-native-paper';
import useTheme from "../../../hooks/useTheme";

type Props = {
  dates: Date[];
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
}

export default function Calendar({ dates, selectedDate, setSelectedDate }: Props) {
  const theme = useTheme();

  const isDateSelected = (dayjsDate) => dayjsDate.isSame(selectedDate, 'day');

  const renderCalendarItem = ({ item: date }: { item: Date }) => {
    const dayjsDate = dayjs(date);

    return (
      <Pressable onPress={() => setSelectedDate(date)} style={{ borderRadius: 16 }}>
        <View
          style={styles.item(isDateSelected(dayjsDate) ? theme.colors.primary : theme.colors.surface)}>
          <Text style={{ ...(isDateSelected(dayjsDate) && { color: theme.colors.onPrimaryContainer }) }}>{dayjsDate.format('ddd')}</Text>
          <Text style={{ ...(isDateSelected(dayjsDate) && { color: theme.colors.onPrimaryContainer }) }}>{dayjsDate.format('MMM')} {dayjsDate.format('D')}</Text>
        </View>
      </Pressable>
    )
  };

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={dates}
      renderItem={renderCalendarItem}
      keyExtractor={item => item.getTime().toString()}
      ItemSeparatorComponent={HorizontalItemSeparatorComponent}
      style={{ marginBottom: 32 }}
    />
  )
}

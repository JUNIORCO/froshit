import React, { Dispatch, SetStateAction } from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import { styles } from "./Calendar.styles";
import HorizontalItemSeparatorComponent from "../../common/HorizontalItemSeparatorComponent";
import dayjs from "../../../utils/dayjs";
import { Box } from "native-base";
import { SUBDOMAIN_COLOR_PALETTE } from "../../../theme/subdomain-color-palette";
import { ValidSubdomains } from "../../../theme/subdomains";
import useSession from "../../../hooks/useSession";

type Props = {
  dates: Date[];
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
}

export default function Calendar({ dates, selectedDate, setSelectedDate }: Props) {
  const { profile } = useSession();
  const selectedColor = SUBDOMAIN_COLOR_PALETTE[profile.university.subdomain as ValidSubdomains]["400"];
  const unselectedColor = SUBDOMAIN_COLOR_PALETTE[profile.university.subdomain as ValidSubdomains]["50"];

  const isDateSelected = (dayjsDate) => dayjsDate.isSame(selectedDate, 'day');

  const renderCalendarItem = ({ item: date }: { item: Date }) => {
    const dayjsDate = dayjs(date);

    return (
      <Pressable onPress={() => setSelectedDate(date)}>
        <Box style={styles.item(isDateSelected(dayjsDate) ? selectedColor : unselectedColor)}>
          <Text style={styles.date}>{dayjsDate.format('MMM')}</Text>
          <Text style={styles.date}>{dayjsDate.format('D')}</Text>
        </Box>
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

import * as React from 'react';
import { useState } from 'react';
import { Card, Text } from 'react-native-paper';
import { styles } from "./EventCard.styles";
import { Linking, Platform, Pressable, View } from "react-native";
import dayjs from "../../../utils/dayjs";
import { Event } from "../../../supabase/types/extended";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import useSession from "../../../hooks/useSession";
import useTheme from "../../../hooks/useTheme";
import CachedImage from 'expo-cached-image';

export default function EventCard({
                                    id,
                                    imageUrl,
                                    name,
                                    location,
                                    startDate,
                                    endDate,
                                    description,
                                    accessibility,
                                    selectedDate,
                                  }: Event['Row'] & { selectedDate: Date }) {
  const { profile } = useSession();
  const theme = useTheme();

  const [pressed, setPressed] = useState<boolean>(false);

  const showCard = dayjs(selectedDate).isSame(startDate, 'day');

  // image
  const uri = imageUrl || 'https://via.placeholder.com/500x500.png?text=Image+Coming+Soon';

  // time
  const timeFormat = 'h:mm a';

  // icons
  const iconColor = theme.colors.primary;
  const iconSize = 32;

  // location
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const url = `${scheme}${location}`;
  const handleLocationPress = () => Linking.openURL(url);

  const handleCardPress = () => setPressed((prev) => !prev);

  const RightContent = ({ startDate, endDate }: Pick<Event['Row'], 'startDate' | 'endDate'>) => (
    <View style={styles.timeContainer}>
      <Text style={styles.timeText}>{dayjs(startDate).format(timeFormat)}</Text>
      <Text style={styles.timeText}>–</Text>
      <Text style={styles.timeText}>{dayjs(endDate).format(timeFormat)}</Text>
    </View>
  );

  const renderCardContent = () => (
    <Card.Content>
      <View style={{ flexDirection: 'column' }}>
        <Text style={{ marginBottom: 8 }}>{description}</Text>

        <View style={styles.cardDescriptionContainer}>
          <Ionicons name="location-sharp" size={iconSize} color={iconColor} style={styles.icon}/>
          <View style={{ flexDirection: 'column' }}>
            <Text>{location}</Text>
            <Pressable onPress={handleLocationPress}>
              <Text style={styles.helperText}>Click to open maps</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.cardDescriptionContainer}>
          <FontAwesome name="universal-access" size={iconSize} color={iconColor} style={styles.icon}/>
          <Text>{accessibility}</Text>
        </View>
      </View>
    </Card.Content>
  );

  return (
    <Card onPress={handleCardPress} style={{ display: showCard ? 'flex' : 'none', marginBottom: 24, borderRadius: 16 }}>
      <CachedImage
        style={{ width: '100%', height: 256, borderTopRightRadius: 16, borderTopLeftRadius: 16 }}
        source={{ uri }}
        cacheKey={`${id}-${(imageUrl || '').split('/').pop()}`}
      />
      <Card.Title
        title={name}
        subtitle={location}
        subtitleNumberOfLines={2}
        right={() => <RightContent startDate={startDate} endDate={endDate}/>}
        style={styles.titleContainer}
      />
      {pressed && renderCardContent()}
    </Card>
  );
}

import * as React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { styles } from "./EventCard.styles";
import { Text, View } from "react-native";
import dayjs from "../../../utils/dayjs";

const LeftContent = props => <Avatar.Icon {...props} icon="camera"/>

const RightContent = ({ startDate, endDate }) => (
  <View style={{ marginRight: 12 }}>
    <Text style={{ fontSize: 12, fontWeight: '200' }}>{dayjs(startDate).format('h:mma')}</Text>
    <Text style={{ fontSize: 12, fontWeight: '200', alignSelf: 'center' }}>–</Text>
    <Text style={{ fontSize: 12, fontWeight: '200' }}>{dayjs(endDate).format('h:mma')}</Text>
  </View>
);

export default function EventCard({ imageUrl, name, location, startDate, endDate, description, handleCardClick }) {
  return (
    <Card style={styles.container} onPress={handleCardClick}>
      <Card.Cover source={{ uri: imageUrl }}/>
      <Card.Title
        title={name}
        subtitle={`${description.slice(0, 30)}...\n${location}`}
        subtitleNumberOfLines={2}
        left={LeftContent}
        right={() => <RightContent startDate={startDate} endDate={endDate}/>}
        style={{ padding: 16 }}
      />
    </Card>
  );
}

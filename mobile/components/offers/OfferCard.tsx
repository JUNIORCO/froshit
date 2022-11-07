import * as React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { styles } from "./OfferCard.styles";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OfferCard({ title, description, icon, provider, colour }) {

  const LeftContent = props => <Avatar.Icon {...props} color={colour} icon="folder"/>;

  // const RightContent = () => (
  //   <View style={{ marginRight: 12 }}>
  //     <Ionicons name="call-outline" size={32}/>
  //   </View>
  // );

  return (
    <Card style={styles.container}>
      <Card.Title
        title={title}
        subtitle={description}
        subtitleNumberOfLines={2}
        left={LeftContent}
        // right={RightContent}
        style={{ padding: 16 }}
      />
    </Card>
  );
}

import * as React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { styles } from "./TeamCard.styles";
import { Linking, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LeaderCard({ imageUrl, firstName, lastName, phoneNumber, interests }) {
  const handlePhonePress = () => {
    void Linking.openURL(`tel:${phoneNumber}`);
  }

  const avatarIconProps = imageUrl ? { src: { uri: imageUrl } } : { icon: 'account-circle-outline' };

  const LeftContent = props => <Avatar.Icon {...props} {...avatarIconProps} />;

  const RightContent = () => (
    <View style={{ marginRight: 12 }}>
      <Ionicons name="call-outline" size={32} onPress={handlePhonePress}/>
    </View>
  );

  return (
    <Card style={styles.container}>
      <Card.Title
        title={`${firstName} ${lastName}`}
        subtitle={`Program - \nInterests - `}
        subtitleNumberOfLines={2}
        left={LeftContent}
        right={RightContent}
        style={{ padding: 16 }}
      />
    </Card>
  );
}

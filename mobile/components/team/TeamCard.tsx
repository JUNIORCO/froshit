import * as React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { styles } from "./TeamCard.styles";
import { Image, Linking, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function TeamCard({ imageUrl, firstName, lastName, phoneNumber, interests, program, isLeader }) {
  const handlePhonePress = () => Linking.openURL(`tel:${phoneNumber}`);

  const renderAvatarIcon = () => <Avatar.Icon icon='account-circle-outline'/>;

  const renderUserImage = () => <Image style={styles.image} source={{ uri: imageUrl }}/>;

  const LeftContent = () => imageUrl ? renderUserImage() : renderAvatarIcon();

  const RightContent = () => (
    <View style={{ marginRight: 12 }}>
      <Feather name="phone-call" size={32} onPress={handlePhonePress} color='#25D366'/>
    </View>
  );

  const subtitle = `${program ? `Program: ${program}` : ''}\n${interests ? `Interests: ${interests}` : ''}`.trim();

  return (
    <Card style={styles.container}>
      <Card.Title
        title={`${firstName} ${lastName}`}
        subtitle={subtitle}
        subtitleNumberOfLines={2}
        left={LeftContent}
        right={isLeader && RightContent}
      />
    </Card>
  );
}

import * as React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { styles } from "./TeamCard.styles";
import { Image, Linking, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LoggedInProfile } from "../../supabase/database.types";

type Props = LoggedInProfile & { isLeader?: boolean };

export default function TeamCard({ imageUrl, firstName, lastName, phoneNumber, interests, program, isLeader }: Props) {
  const title = `${firstName} ${lastName}`;
  const subtitle = `${program ? `Program: ${program}` : ''}\n${interests ? `Interests: ${interests}` : ''}`.trim();

  const handlePhonePress = () => Linking.openURL(`tel:${phoneNumber}`);

  const renderAvatarIcon = () => <Avatar.Icon style={styles.image} icon='account-circle-outline' />;

  const renderUserImage = (imageUrl: string) => <Image style={styles.image} source={{ uri: imageUrl }} />;

  const LeftContent = () => imageUrl ? renderUserImage(imageUrl) : renderAvatarIcon();

  const RightContent = () => (
    <View style={{ marginRight: 12 }}>
      <Feather name="phone-call" size={32} onPress={handlePhonePress} color='#25D366'/>
    </View>
  );

  return (
    <Card style={styles.container}>
      <Card.Title
        title={title}
        subtitle={subtitle}
        subtitleNumberOfLines={2}
        left={LeftContent}
        right={isLeader ? RightContent : undefined}
        style={{ paddingLeft: 0 }}
      />
    </Card>
  );
}

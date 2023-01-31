import * as React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { styles } from "./TeamCard.styles";
import { Image, Linking, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import useSession from "../../hooks/useSession";
import CachedImage from 'expo-cached-image';

// todo need to return type of getTeam
type Props = any & { isLeader?: boolean };

export default function TeamCard({ id, imageUrl, firstName, lastName, phoneNumber, interests, program, faculty, isLeader }: Props) {
  const { profile } = useSession();

  const title = `${firstName} ${lastName}`;
  const subtitle = `${faculty ? `Faculty: ${faculty}` : ''}\n${program ? `Program: ${program}` : ''}\n${interests ? `Interests: ${interests}` : ''}`.trim();
  const showPhoneContent = isLeader && profile.id !== id;

  const handlePhonePress = () => Linking.openURL(`tel:${phoneNumber}`);

  const renderAvatarIcon = () => <Avatar.Icon style={styles.image} icon='account-circle-outline' />;

  const renderUserImage = (imageUrl: string) => <CachedImage style={styles.image} source={{ uri: imageUrl }} cacheKey={`${id}-${imageUrl.split('/').pop()}`}/>;

  const AvatarContent = () => imageUrl ? renderUserImage(imageUrl) : renderAvatarIcon();

  const PhoneContent = () => (
    <View style={styles.phoneContent}>
      <Feather name="phone" size={32} onPress={handlePhonePress}/>
    </View>
  );

  return (
    <Card style={styles.card}>
      <Card.Title
        title={title}
        subtitle={subtitle || undefined}
        subtitleNumberOfLines={3}
        left={AvatarContent}
        right={showPhoneContent ? PhoneContent : undefined}
        style={styles.innerCard}
      />
    </Card>
  );
}

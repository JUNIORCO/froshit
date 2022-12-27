import * as React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { styles } from "./TeamCard.styles";

export default function FrosheeCard({ imageUrl, firstName, lastName, interests }) {
  const avatarIconProps = imageUrl ? { src: { uri: imageUrl } } : { icon: 'account-circle-outline' };

  const LeftContent = props => <Avatar.Icon {...props} {...avatarIconProps}/>;

  return (
    <Card style={styles.container}>
      <Card.Title
        title={`${firstName} ${lastName}`}
        subtitle={`Program - \nInterests -`}
        subtitleNumberOfLines={2}
        left={LeftContent}
        style={{ padding: 16 }}
      />
    </Card>
  );
}

import * as React from 'react';
import { Avatar, Card } from 'react-native-paper';
import { styles } from "./TeamCard.styles";

export default function FrosheeCard({ avatarUrl, name, interests, programId }) {
  const LeftContent = props => <Avatar.Icon {...props} icon="account-circle-outline"/>;

  return (
    <Card style={styles.container}>
      <Card.Title
        title={name}
        subtitle={`Program - ${programId.name}\nInterests - ${interests.join(', ')}`}
        subtitleNumberOfLines={2}
        left={LeftContent}
        style={{ padding: 16 }}
      />
    </Card>
  );
}

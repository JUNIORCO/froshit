import * as React from 'react';
import { Card } from 'react-native-paper';
import { Image, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: 48,
    height: 48,
  }
});

export default function OfferCard({ title, description, location, provider, imageUrl }: any) {

  const LeftContent = () => <Image style={styles.image} source={{ uri: imageUrl }}/>;

  const formattedDescription = `${provider} at ${location}\n${description}`

  return (
    <Card style={styles.container}>
      <Card.Title
        title={title}
        subtitle={formattedDescription}
        subtitleNumberOfLines={6}
        left={LeftContent}
      />
    </Card>
  );
}

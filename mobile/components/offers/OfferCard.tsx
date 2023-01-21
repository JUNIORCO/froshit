import * as React from 'react';
import { Card } from 'react-native-paper';
import { Image, StyleSheet } from "react-native";
import { Offer } from "../../supabase/extended.types";

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    padding: 16,
    elevation: 2,
    borderRadius: 16,
  },
  image: {
    width: 48,
    height: 48,
  }
});

export default function OfferCard({ title, description, location, provider, color, imageUrl }: Offer['Row']) {

  const LeftContent = () => <Image style={styles.image} source={{ uri: imageUrl }}/>;

  const formattedDescription = `${provider}, ${location}\n${description}`

  return (
    <Card style={styles.container}>
      <Card.Title
        title={title}
        subtitle={formattedDescription}
        subtitleNumberOfLines={6}
        left={LeftContent}
        style={{ paddingLeft: 0 }}
      />
    </Card>
  );
}

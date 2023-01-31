import * as React from 'react';
import { Card } from 'react-native-paper';
import { StyleSheet } from "react-native";
import { Offer } from "../../supabase/types/extended";
import CachedImage from 'expo-cached-image';

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    padding: 16,
    elevation: 2,
    borderRadius: 16,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  }
});

export default function OfferCard({ id, title, description, location, provider, imageUrl }: Offer['Row']) {
  const formattedDescription = `${provider}, ${location}\n${description}`;
  const cacheKey =`${id}-${imageUrl.split('/').pop()}`;

  const LeftContent = () => <CachedImage style={styles.image} source={{ uri: imageUrl, expiresIn: 0 }} resizeMode="contain" cacheKey={cacheKey}/>;

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

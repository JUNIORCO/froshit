import { Image, Linking, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import EventsProvider from "../../../contexts/EventsContext";
import React from "react";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import dayjs from "dayjs";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 16,
    marginBottom: 0,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 16,
  },
  helperText: {
    fontSize: 12,
    color: 'grey'
  }
});

export default function EventDetails({ route }) {
  const { imageUrl, name, location, startDate, endDate, description, accessibility } = route.params;

  const handleLocationPress = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const url = `${scheme}${location}`;
    void Linking.openURL(url);
  }

  return (
    <EventsProvider>
      <SafeAreaView style={styles.container}>
        <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 248, marginBottom: 16, }}/>
        <Text style={styles.titleText}>{name}</Text>
        <Text style={styles.descriptionText}>{description}</Text>

        <View style={{ flexDirection: "row", height: 50, marginBottom: 8, alignItems: 'center' }}>
          <Ionicons name="time-outline" size={32} color="#E91E63"
                    style={{ flex: 0.15, textAlign: 'center', paddingRight: 8 }}/>
          <View style={{ flexDirection: 'column' }}>
            <Text>{dayjs(startDate).format('MMMM D, YYYY')}</Text>
            <Text>{dayjs(startDate).format('h:m a')} - {dayjs(endDate).format('h:m a')}</Text>
          </View>
        </View>

        <Pressable onPress={handleLocationPress}>
          <View style={{ flexDirection: "row", height: 50, marginBottom: 8, alignItems: 'center' }}>
            <Ionicons name="location" size={32} color="#E91E63"
                      style={{ flex: 0.15, textAlign: 'center', paddingRight: 8 }}/>
            <View style={{ flexDirection: 'column' }}>
              <Text>{location}</Text>
              <Text style={styles.helperText}>Click to open maps</Text>
            </View>
          </View>
        </Pressable>

        <View style={{ flexDirection: "row", height: 50, marginBottom: 8, alignItems: 'center' }}>
          <FontAwesome name="universal-access" size={32} color="#E91E63"
                       style={{ flex: 0.15, textAlign: 'center', paddingRight: 8 }}/>
          <View style={{ flexDirection: 'column' }}>
            <Text>{accessibility}</Text>
          </View>
        </View>

      </SafeAreaView>
    </EventsProvider>
  );
}

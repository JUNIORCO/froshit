import { Image, Linking, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import EventsProvider from "../../../context/EventsContext";
import React from "react";
import { Ionicons } from '@expo/vector-icons';

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
  }
});

export default function EventDetails({ route }) {
  const { name, location, startDate, endDate, description, } = route.params;

  const onClickOpenMap = (searchString: string) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const url = `${scheme}${searchString}`;
    void Linking.openURL(url);
  }

  return (
    <EventsProvider>
      <SafeAreaView style={styles.container}>
        <Image source={{ uri: 'https://picsum.photos/700' }} style={{ width: '100%', height: 248, marginBottom: 16, }}/>
        <Text style={styles.titleText}>{name}</Text>
        <Text>{description}</Text>
        <View style={{ flexDirection: "row", height: 50, marginBottom: 16, }}>
          <Ionicons name="location-sharp" size={32} color="#E91E63" style={{ flex: 0.2, backgroundColor: "white" }}/>
          <View style={{ backgroundColor: "blue", flex: 0.3 }}/>
          <View style={{ backgroundColor: "red", flex: 0.5 }}/>
          <Text>Hello World!</Text>
        </View>
        <View style={{ flexDirection: "row", height: 50, marginBottom: 16, }}>
          <Ionicons name="time-outline" size={32} color="#E91E63" style={{ flex: 0.2, backgroundColor: "white" }}/>
          <View style={{ backgroundColor: "blue", flex: 0.3 }}/>
          <View style={{ backgroundColor: "red", flex: 0.5 }}/>
          <Text>Hello World!</Text>
        </View>
      </SafeAreaView>
    </EventsProvider>
  );
}

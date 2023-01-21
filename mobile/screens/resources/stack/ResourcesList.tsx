import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import VerticalItemSeparatorComponent from "../../../components/common/VerticalItemSeparatorComponent";
import React from "react";
import ResourceCard from "../../../components/resources/ResourceCard";

const { width } = Dimensions.get('window');
const dim = (width) / 2.1 * 0.93;

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    height: '100%',
  },
  title: {
    fontSize: 32,
    marginVertical: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    marginVertical: 16,
  },
  square: {
    width: dim,
    height: dim,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  }
});

export default function ResourceTagsList({ route }) {

  const { resources, tag } = route.params;

  const renderResource = ({ item: resource }) => <ResourceCard {...resource} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{tag.name}</Text>
      <FlatList
        scrollEnabled={false}
        data={resources}
        showsVerticalScrollIndicator={false}
        renderItem={renderResource}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={VerticalItemSeparatorComponent}
      />
    </SafeAreaView>
  )
}

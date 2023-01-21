import { Dimensions, FlatList, ImageBackground, Pressable, StyleSheet, Text } from "react-native";
import { useGetResources } from "../../../hooks/query";
import VerticalItemSeparatorComponent from "../../../components/common/VerticalItemSeparatorComponent";
import React from "react";
import { flow, groupBy, map } from 'lodash/fp';
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";

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
    fontSize: 32,
    fontWeight: 'bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  square: {
    width: dim * 0.9,
    height: dim * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    borderRadius: 16,
  }
});

export default function ResourceTagsList() {
  const {
    isLoading: teamIsLoading,
    isError: teamIsError,
    data: resources,
    error: teamError,
  } = useGetResources();

  const navigation = useNavigation();

  const resourcesGroupedByResourceTag = flow(
    groupBy('resourceTagId.id'),
    map((resources) => ({ tag: resources[0].resourceTagId, resources }))
  )(resources);

  const handleOnPress = ({ resources, tag }) => navigation.navigate('Resources List' as any, { resources, tag } as any);

  const renderResourceTag = ({ item }) => {
    const { resources, tag } = item;
    return (
      <ImageBackground source={{ uri: tag.imageUrl }} imageStyle={styles.imageBackground}>
        <Pressable style={styles.square} onPress={() => handleOnPress({ resources, tag })}>
          <Text style={styles.header}>{tag.name}</Text>
        </Pressable>
      </ImageBackground>
    );
  }

  return (
    <Card style={{ padding: 16, borderRadius: 16, opacity: 0.97 }}>
      <FlatList
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        data={resourcesGroupedByResourceTag}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={renderResourceTag}
        keyExtractor={item => item.tag.id}
        ItemSeparatorComponent={VerticalItemSeparatorComponent}
      />
    </Card>
  )
}

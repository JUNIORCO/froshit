import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text
} from "react-native";
import { useGetResources } from "../../../hooks/query";
import VerticalItemSeparatorComponent from "../../../components/common/VerticalItemSeparatorComponent";
import React from "react";
import { useRefetchByUser } from "../../../hooks/useRefetchByUser";
import { flow, groupBy, map } from 'lodash/fp';
import { useNavigation } from "@react-navigation/native";

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
    width: dim,
    height: dim,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    borderRadius: 32,
    opacity: 0.8,
  }
});

export default function ResourceTagsList() {
  const {
    isLoading: teamIsLoading,
    isError: teamIsError,
    data: resources,
    error: teamError,
  } = useGetResources();
  const { isRefetchingByUser, refetchByUser } = useRefetchByUser();

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Resources</Text>
      <FlatList
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        data={resourcesGroupedByResourceTag}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={renderResourceTag}
        keyExtractor={item => item.tag.id}
        ItemSeparatorComponent={VerticalItemSeparatorComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingByUser}
            onRefresh={refetchByUser}
          />
        }
      />
    </SafeAreaView>
  )
}

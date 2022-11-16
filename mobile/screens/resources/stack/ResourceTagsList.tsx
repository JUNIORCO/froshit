import { Dimensions, FlatList, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text } from "react-native";
import { useGetResources } from "../../../hooks/query";
import VerticalItemSeparatorComponent from "../../../components/common/VerticalItemSeparatorComponent";
import React from "react";
import { useRefetchByUser } from "../../../hooks/useRefetchByUser";
import Ionicons from "@expo/vector-icons/Ionicons";
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
    fontSize: 24,
    marginVertical: 16,
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
      <Pressable style={styles.square} onPress={() => handleOnPress({ resources, tag })}>
        <Ionicons
          name={tag.icon}
          color='white'
          size={64}
        />
        <Text>{tag.name}</Text>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Offers</Text>
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

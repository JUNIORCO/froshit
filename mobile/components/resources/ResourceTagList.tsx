import { styles } from "../../screens/styles/ResourcesScreen";
import { Dispatch, SetStateAction, useEffect } from "react";
import { flow, groupBy, map, sortBy } from "lodash/fp";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { useGetResources } from "../../hooks/query";
import { Resource, ResourceTag } from "../../supabase/types/extended";
import { CacheManager } from 'expo-cached-image'

export type GroupedResource = {
  resources: (Resource['Row'] & { resourceTagId: Omit<ResourceTag['Row'], 'createdAt' | 'updatedAt'> })[];
  tag: Omit<ResourceTag['Row'], 'createdAt' | 'updatedAt'>;
};

type Props = {
  setSelectedTag: Dispatch<SetStateAction<GroupedResource | null>>;
}

export default function ResourceTagList({ setSelectedTag }: Props) {
  const {
    isLoading: teamIsLoading,
    isError: teamIsError,
    data: resources,
    error: teamError,
  } = useGetResources();

  const resourcesGroupedByResourceTag: GroupedResource[] = flow(
    sortBy('resourceTagId.name'),
    groupBy<any>('resourceTagId.id'),
    map((resources) => ({ tag: resources[0].resourceTagId, resources })),
  )(resources);

  const renderResourceTag = (group: GroupedResource) => {
    const { tag } = group;

    return (
      <ImageBackground key={tag.name} source={{ uri: tag.imageUrl }} imageStyle={styles.imageBackground}>
        <Pressable style={styles.square} onPress={() => setSelectedTag(group)}>
          <Text style={styles.header}>{tag.name}</Text>
        </Pressable>
      </ImageBackground>
    );
  };

  const cacheResourceTagImages = async (resources) => {
    await Promise.allSettled(resources.map(resource =>
      CacheManager.addToCache({
        file: resource.imageUrl,
        key: resource.id,
      })
    ));
  }

  useEffect(() => {
    void cacheResourceTagImages(resources);
  }, [resources]);

  return (
    <View style={styles.flexContainer}>
      {resourcesGroupedByResourceTag.map(renderResourceTag)}
    </View>)
}

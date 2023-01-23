import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Card, Button } from 'react-native-paper';
import { Linking, StyleSheet, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { GroupedResource } from "./ResourceTagList";
import { Resource, ResourceTag } from "../../supabase/extended.types";

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

type Props = {
  selectedTag: GroupedResource;
  setSelectedTag: Dispatch<SetStateAction<GroupedResource | null>>;
}

export default function ResourceCard({ selectedTag, setSelectedTag }: Props) {
  const { resources, tag } = selectedTag;
  const handlePhonePress = (phoneNumber: string) => Linking.openURL(`tel:${phoneNumber}`);

  const handleEmailPress = (email: string) => Linking.openURL(`mailto:${email}`);

  const RightContent = ({ email, phoneNumber }: Pick<Resource['Row'], 'email' | 'phoneNumber'>) => (
    <View style={{ flexDirection: 'row' }}>
      {email && <Feather name="mail" size={32} onPress={() => handleEmailPress(email)} style={{ marginRight: 16 }}/>}
      {phoneNumber &&
      <Feather name="phone-call" size={32} onPress={() => handlePhonePress(phoneNumber)} color='#25D366'/>}
    </View>
  );

  const renderResourceCard = (resource: (Resource['Row'] & { resourceTagId: Omit<ResourceTag['Row'], 'createdAt' | 'updatedAt'> })) => (
    <Card style={styles.container} key={resource.id}>
      <Card.Title
        title={resource.title}
        subtitle={resource.description}
        subtitleNumberOfLines={6}
        right={() => <RightContent email={resource.email} phoneNumber={resource.phoneNumber}/>}
        style={{ padding: 16 }}
      />
    </Card>
  )

  return (
    <View style={{ flexDirection: 'column' }}>
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 8,
      }}>
        <Button
          icon='arrow-left'
          mode="text"
          onPress={() => setSelectedTag(null)}
        >Back</Button>
      </View>
      {resources.map(renderResourceCard)}
    </View>);
}

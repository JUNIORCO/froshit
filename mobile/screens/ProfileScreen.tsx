import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import useSession from "../hooks/useSession";
import { Button, Card } from "react-native-paper";
import { supabase } from "../supabase/supabase";
import { FormControl, Input, ScrollView, useToast, VStack } from "native-base";
import { Profile, Tables } from "../supabase/extended.types";

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
});


export default function ProfileScreen() {
  const { profile } = useSession();
  const toast = useToast();

  const [saving, setSaving] = useState<boolean>(false);
  const [interests, setInterests] = useState<string>(profile!.interests || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(profile!.phoneNumber || '');

  const handleSave = async () => {
    setSaving(true);

    const { error: updateProfileError } = await supabase
      .from<typeof Tables.profile, Profile>(Tables.profile)
      .update({ interests, phoneNumber: phoneNumber === '' ? null : phoneNumber })
      .match({ id: profile!.id });

    setSaving(false);

    if (updateProfileError) {
      toast.show({ description: 'Failed to update your profile', placement: "top", variant: 'subtle' });
    } else {
      toast.show({ description: 'Updated profile', placement: "top", variant: 'subtle' });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Card elevation={4}>
        <ScrollView>
          <Card.Cover source={{ uri: profile!.imageUrl }} style={{ height: 296 }}/>
          <Card.Title title={`${profile!.firstName} ${profile!.lastName}`} subtitle={profile!.email}/>
          <Card.Content>
            <VStack space={1}>
              <FormControl.Label>Phone Number</FormControl.Label>
              <Input
                size="lg"
                onChangeText={setPhoneNumber}
                value={phoneNumber}
                placeholder="Phone Number"
                keyboardType='number-pad'
              />
              <FormControl.Label>Interests</FormControl.Label>
              <Input
                size="lg"
                onChangeText={setInterests}
                value={interests}
                placeholder="Interests"
              />
            </VStack>
          </Card.Content>
          <Card.Actions style={{ alignSelf: 'flex-end' }}>
            <VStack space={8}>
              <Button icon="content-save-outline" mode='contained' onPress={handleSave} loading={saving}>Save</Button>
              <Button icon="logout" onPress={() => supabase.auth.signOut()}>Sign Out</Button>
            </VStack>
          </Card.Actions>
        </ScrollView>
      </Card>
    </SafeAreaView>
  )
}

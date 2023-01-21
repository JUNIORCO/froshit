import React, { useState } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import useSession from "../hooks/useSession";
import { Avatar, Button, Card } from "react-native-paper";
import { supabase } from "../supabase/supabase";
import { FormControl, Input, Text, useToast, VStack } from "native-base";
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

  const cardTitle = `${profile.firstName} ${profile.lastName}`;
  const cardSubtitle = profile.email;

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Card style={{ padding: 16, borderRadius: 16 }}>
        <Avatar.Image
          size={128}
          source={{ uri: profile.imageUrl || 'https://www.gravatar.com/avatar/?d=mp' }}
        />
        <Text style={{ alignSelf: 'flex-end' }}>TODO Upload image button</Text>
        <Card.Title title={cardTitle} subtitle={cardSubtitle}/>
        <Card.Content>
          <VStack space={2}>
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
        <Card.Actions>
          <VStack space={2} style={{ width: '100%' }}>
            <Button icon="content-save-outline" mode='contained' onPress={handleSave} loading={saving}>Save</Button>
            <Button icon="logout" onPress={() => supabase.auth.signOut()}>Sign Out</Button>
          </VStack>
        </Card.Actions>
      </Card>
    </TouchableWithoutFeedback>
  )
}

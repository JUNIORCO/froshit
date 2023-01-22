import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, Text, View } from 'react-native';
import useSession from "../hooks/useSession";
import { Avatar, Button, Card, TextInput } from "react-native-paper";
import { supabase } from "../supabase/supabase";
import { useRefetchByUser } from "../hooks/useRefetchByUser";
import { commonStyles } from './styles/Common.styles';
import { styles } from "./styles/ProfileScreen.styles";
import { db } from "../supabase/db";

export default function ProfileScreen() {
  const { refetchByUser } = useRefetchByUser();
  const { profile } = useSession();

  const [saving, setSaving] = useState<boolean>(false);
  const [interests, setInterests] = useState<string>(profile.interests || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(profile.phoneNumber || '');

  const cardTitle = `${profile.firstName} ${profile.lastName}`;
  const cardSubtitle = profile.email;
  const imageSource = { uri: profile.imageUrl || 'https://www.gravatar.com/avatar/?d=mp' };

  const handleSave = async () => {
    setSaving(true);

    const { error: updateProfileError } = await db.profile.updateProfile(profile.id, {
      interests: interests == '' ? null : interests,
      phoneNumber: phoneNumber == '' ? null : phoneNumber,
    });

    await refetchByUser();

    setSaving(false);

    // TODO handle error
    // if (updateProfileError) {
    //   toast.show({ description: 'Failed to update your profile', placement: "top", variant: 'subtle' });
    // } else {
    //   toast.show({ description: 'Updated profile', placement: "top", variant: 'subtle' });
    // }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Card style={commonStyles.mainCard}>
        <Avatar.Image size={128} source={imageSource}/>
        <Card.Title title={cardTitle} subtitle={cardSubtitle}/>
        <Card.Content>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'column' }}>
              <Text>Phone Number</Text>
              <TextInput
                onChangeText={setPhoneNumber}
                value={phoneNumber}
                placeholder="Phone Number"
                keyboardType='number-pad'
              />
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text>Interests</Text>
              <TextInput
                onChangeText={setInterests}
                value={interests}
                placeholder="Interests"
              />
            </View>
          </View>
        </Card.Content>
        <Card.Actions>
          <View style={styles.buttonContainer}>
            <Button mode='contained' onPress={handleSave} loading={saving}>Save</Button>
            <Button onPress={() => supabase.auth.signOut()}>Sign Out</Button>
          </View>
        </Card.Actions>
      </Card>
    </TouchableWithoutFeedback>
  )
}

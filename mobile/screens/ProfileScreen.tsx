import React, { useState } from 'react';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import useSession from "../hooks/useSession";
import { Avatar, Button, Card, Dialog, Portal, Provider, TextInput } from "react-native-paper";
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
    Keyboard.dismiss();
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

  const [visible, setVisible] = useState<boolean>(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const signOut = () => supabase.auth.signOut();

  return (
    <View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Card style={commonStyles.mainCard}>
          <Avatar.Image size={128} source={imageSource}/>
          <Card.Title title={cardTitle} subtitle={cardSubtitle}/>
          <Card.Content>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'column', marginBottom: 8 }}>
                <Text style={{ marginBottom: 4, fontSize: 16 }}>Phone Number</Text>
                <TextInput
                  mode='outlined'
                  onChangeText={setPhoneNumber}
                  value={phoneNumber}
                  placeholder="Phone Number"
                  keyboardType='number-pad'
                />
              </View>
              <View style={{ flexDirection: 'column', marginBottom: 8 }}>
                <Text style={{ marginBottom: 4, fontSize: 16 }}>Interests</Text>
                <TextInput
                  mode='outlined'
                  onChangeText={setInterests}
                  value={interests}
                  placeholder="Interests"
                />
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <View style={styles.buttonContainer}>
              <Button mode='contained' onPress={handleSave} loading={saving} style={{ marginBottom: 8 }}>Save</Button>
              <Button onPress={showDialog}>Sign Out</Button>
            </View>
          </Card.Actions>
        </Card>
      </TouchableWithoutFeedback>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Sign Out</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to sign out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>No</Button>
            <Button onPress={signOut}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

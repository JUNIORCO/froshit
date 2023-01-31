import * as React from 'react';
import { Fragment, useState } from 'react';
import { Button, Text, TextInput } from 'react-native-paper';
import { Keyboard, View } from "react-native";
import { db } from "../../supabase/db";
import useSession from "../../hooks/useSession";
import { useRefetchByUser } from "../../hooks/useRefetchByUser";
import { commonStyles } from "./Common.styles";

export default function PersonalInformationSection() {
  const { refetchByUser } = useRefetchByUser();
  const { profile } = useSession();

  const [saving, setSaving] = useState<boolean>(false);
  const [interests, setInterests] = useState<string>(profile.interests || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(profile.phoneNumber || '');

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


  return (
    <Fragment>
      <Text style={commonStyles.title}>Personal Information</Text>
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
      <Button mode='contained' onPress={handleSave} loading={saving} style={{ marginVertical: 16 }}>Save</Button>
    </Fragment>
  );
}

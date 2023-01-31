import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import useSession from "../hooks/useSession";
import { Avatar, Button, Card, Dialog, Portal, Text } from "react-native-paper";
import { supabase } from "../supabase/supabase";
import { commonStyles } from './styles/Common.styles';
import { styles } from "./styles/ProfileScreen.styles";
import PreferencesSection from "../components/profile/PreferencesSection";
import PersonalInformationSection from "../components/profile/PersonalInformationSection";
import SectionDivider from "../components/profile/SectionDivider";

export default function ProfileScreen() {
  const { profile } = useSession();

  const cardTitle = `${profile.firstName} ${profile.lastName}`;
  const cardSubtitle = profile.email;
  const imageSource = { uri: profile.imageUrl || 'https://www.gravatar.com/avatar/?d=mp' };

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
              <PersonalInformationSection/>
              {/*<SectionDivider/>*/}
              {/*<PreferencesSection/>*/}
            </View>
          </Card.Content>
          <Card.Actions style={{ width: '100%' }}>
            <View style={styles.buttonContainer}>
              <Button mode='text' onPress={showDialog}>Sign Out</Button>
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

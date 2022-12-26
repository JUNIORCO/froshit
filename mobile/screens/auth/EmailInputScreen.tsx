import React from 'react'
import { Alert, Button as BackButton, StyleSheet, View } from 'react-native'
import { supabase } from '../../supabase/supabase'
import { Button, Input } from 'react-native-elements'
import Logo from "../../components/common/Logo";
import { useNavigation } from "@react-navigation/native";
import { Tables } from "../../supabase/columns";
import useSignIn from "../../hooks/useSignIn";
import { StackNavigationProp } from '@react-navigation/stack';
import { SignInScreenNames, SignInStackParamList } from "../../@types/navigation";

export default function EmailInputScreen() {
  const { selectedUniversityId, email, setEmail, resetSignInFields } = useSignIn();
  const navigation = useNavigation<StackNavigationProp<SignInStackParamList>>();

  const handleNextScreen = () => {
    navigation.navigate(SignInScreenNames.VERIFY_CODE);
  };

  const handleBackPress = () => {
    resetSignInFields();
    navigation.navigate(SignInScreenNames.UNIVERSITY_SELECT);
  };

  async function signInWithEmail() {
    // check if profile exists
    // @ts-ignore
    const { data: dbProfile, error: profileError } = await supabase
      .from(Tables.PROFILE)
      .select('*, university (id, subdomain)')
      .eq('email', email)
      .single();

    if (!dbProfile || profileError) {
      Alert.alert('User not found');
      return;
    }

    // check if profile belongs to university
    if (dbProfile.university.id !== selectedUniversityId) {
      Alert.alert('User does not belong to this university');
      return;
    }

    // check if profile is froshee/leader
    if (!['Leader', 'Froshee'].includes(dbProfile.role)) {
      Alert.alert('User unauthorized to access app');
      return;
    }

    const { error: signInOtpError } = await supabase
      .auth
      .signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });

    signInOtpError ? Alert.alert(signInOtpError.message) : handleNextScreen();
  }

  return (
    <View style={styles.container}>
      <Logo/>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="john.smith@froshit.com"
          autoCapitalize='none'
          autoComplete='email'
          autoCompleteType='email'
          textContentType='emailAddress'
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)}
          onPress={signInWithEmail}
        />
        <BackButton
          title="Back"
          onPress={handleBackPress}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})

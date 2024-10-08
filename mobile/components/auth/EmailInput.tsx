import React, { Fragment } from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import { supabase } from '../../supabase/supabase'
import useSignIn from "../../hooks/useSignIn";
import { db } from "../../supabase/db";
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SignInSteps } from "./steps";

export default function EmailInput() {
  const { loading, setLoading, setStep, error, setError, email, setEmail } = useSignIn();
  const theme = useTheme();

  async function signInWithEmail() {
    setLoading(true);
    Keyboard.dismiss();

    // check if profile exists
    const { data: dbProfile, error: profileError } = await db.profile.getProfileByEmail(email);

    if (!dbProfile || profileError) {
      setError('Email not found.');
      setLoading(false);
      return;
    }

    // check if profile is froshee/leader
    if (!['Leader', 'Froshee'].includes(dbProfile.role)) {
      setError('Only Leaders or Froshees can access the app.');
      setLoading(false);
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

    setLoading(false);
    signInOtpError ? setError(signInOtpError.message) : setStep(SignInSteps.VERIFY_OTP);
  }

  const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  return (
    <Fragment>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          mode='outlined'
          label='University Email'
          onChangeText={(email) => setEmail(email)}
          value={email}
          autoCapitalize='none'
          autoComplete='email'
          textContentType='emailAddress'
        />
      </View>
      {error !== '' && <Text style={{ marginTop: 16, marginBottom: 8, color: theme.colors.error }}>{error}</Text>}
      <Button
        disabled={!email.match(emailRegex)}
        onPress={signInWithEmail}
        style={styles.verticallySpaced}
        loading={loading}
        mode='contained'
      >Sign In</Button>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  verticallySpaced: {
    alignSelf: 'stretch',
    marginVertical: 8
  },
  mt20: {
    marginTop: 16,
  },
})

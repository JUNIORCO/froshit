import React, { Fragment } from 'react'
import { Keyboard, StyleSheet, Text, View } from 'react-native'
import { supabase } from '../../supabase/supabase'
import useSignIn from "../../hooks/useSignIn";
import { db } from "../../supabase/db";
import { Alert, Button, Input } from 'native-base';
import { SignInSteps } from "./steps";

export default function EmailInput() {
  const { loading, setLoading, setStep, error, setError, email, setEmail } = useSignIn();

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

  return (
    <Fragment>
      {error !== '' && <Alert status="error"><Text>{error}</Text></Alert>}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          size="lg"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="University Email"
          autoCapitalize='none'
          autoComplete='email'
          textContentType='emailAddress'
        />
      </View>
      <Button
        isDisabled={!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)}
        onPress={signInWithEmail}
        style={styles.verticallySpaced}
        isLoading={loading}
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

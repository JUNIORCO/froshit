import React, { Fragment } from 'react'
import { StyleSheet, View } from 'react-native'
import { supabase } from '../../supabase/supabase'
import { Snackbar, Button, TextInput, Text } from 'react-native-paper';
import useSignIn from "../../hooks/useSignIn";
import { SignInSteps } from "./steps";
import useTheme from "../../hooks/useTheme";

export default function VerifyCode() {
  const { loading, setLoading, error, setError, setStep, email, otp, setOtp, resetSignInFields } = useSignIn();
  const theme = useTheme()

  const handleBack = () => setStep(SignInSteps.EMAIL_INPUT);

  async function signInWithOtp() {
    setLoading(true);
    const { error: verifyOtpError } = await supabase
      .auth
      .verifyOtp({
        email,
        token: otp,
        type: 'magiclink',
      });

    setLoading(false);
    verifyOtpError ? setError(verifyOtpError.message) : resetSignInFields();
  }

  return (
    <Fragment>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={{ marginBottom: 16 }}>We sent a code to {email}</Text>
        <TextInput
          mode='outlined'
          label='Code'
          keyboardType='number-pad'
          maxLength={6}
          onChangeText={(text) => setOtp(text)}
          value={otp}
          autoCapitalize='none'
          autoComplete='off'
          textContentType='none'
        />
      </View>
      <View style={{ flexDirection: 'column', width: '100%' }}>
        {error !== '' && <Text style={{ marginTop: 16, marginBottom: 8, color: theme.colors.error }}>{error}</Text>}
        <Button
          disabled={otp.length !== 6}
          onPress={signInWithOtp}
          style={styles.verticallySpaced}
          loading={loading}
        >Verify</Button>
        <Button
          onPress={handleBack}
          style={styles.verticallySpaced}
        >Back</Button>
      </View>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  verticallySpaced: {
    width: '100%',
    alignSelf: 'stretch',
    marginVertical: 8,
  },
  mt20: {
    marginTop: 20,
  },
})

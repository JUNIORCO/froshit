import React, { Fragment } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { supabase } from '../../supabase/supabase'
import { Alert, Button, Input, VStack } from 'native-base';
import useSignIn from "../../hooks/useSignIn";
import { SignInSteps } from "./steps";

export default function VerifyCode() {
  const { loading, setLoading, error, setError, setStep, email, otp, setOtp, resetSignInFields } = useSignIn();

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
      {error !== '' && <Alert status="error"><Text>{error}</Text></Alert>}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={{ marginBottom: 16 }}>We sent a code to {email}</Text>
        <Input
          size="lg"
          placeholder="Code"
          keyboardType='number-pad'
          maxLength={6}
          onChangeText={(text) => setOtp(text)}
          value={otp}
          autoCapitalize='none'
          autoComplete='off'
          textContentType='none'
        />
      </View>
      <VStack style={{ width: '100%' }}>
        <Button
          isDisabled={otp.length !== 6}
          onPress={signInWithOtp}
          style={styles.verticallySpaced}
          isLoading={loading}
        >Verify</Button>
        <Button
          variant="ghost"
          onPress={handleBack}
          style={styles.verticallySpaced}
        >Back</Button>
      </VStack>
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

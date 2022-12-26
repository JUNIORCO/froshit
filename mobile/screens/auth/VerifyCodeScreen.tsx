import React from 'react'
import { Alert, Button as BackButton, StyleSheet, View } from 'react-native'
import { supabase } from '../../supabase/supabase'
import { Button, Input } from 'react-native-elements'
import Logo from "../../components/common/Logo";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SignInScreenNames, SignInStackParamList } from "../../@types/navigation";
import useSignIn from "../../hooks/useSignIn";

export default function SignInScreen() {
  const { email, otp, setOtp, resetSignInFields } = useSignIn();
  const navigation = useNavigation<StackNavigationProp<SignInStackParamList>>();

  async function signInWithOtp() {
    const { error: verifyOtpError } = await supabase
      .auth
      .verifyOtp({
        email,
        token: otp,
        type: 'magiclink',
      });

    verifyOtpError ? Alert.alert(verifyOtpError.message) : resetSignInFields();
  }

  return (
    <View style={styles.container}>
      <Logo/>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="OTP"
          keyboardType='number-pad'
          maxLength={6}
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setOtp(text)}
          value={otp}
          autoCapitalize='none'
          autoComplete='off'
          autoCompleteType='off'
          textContentType='none'
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Verify OTP"
          disabled={otp.length !== 6}
          onPress={signInWithOtp}
        />
        <BackButton
          title="Back"
          onPress={() => navigation.navigate(SignInScreenNames.EMAIL_INPUT)}
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

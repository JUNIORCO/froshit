import React from 'react'
import { ImageBackground, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import Logo from "../components/common/Logo";
import useSignIn from "../hooks/useSignIn";
import { SignInSteps } from "../components/auth/steps";
import EmailInput from "../components/auth/EmailInput";
import VerifyCode from "../components/auth/VerifyCode";
import useTheme from "../hooks/useTheme";

export default function AuthScreen() {
  const { step } = useSignIn();
  const theme = useTheme();

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.surface
    }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ImageBackground
          source={require('../assets/images/background.png')}
          style={styles.backgroundImage}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{
              padding: 32,
              width: '80%',
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              alignItems: 'center',
            }}>
              <Logo width={250} height={125}/>
              {step === SignInSteps.EMAIL_INPUT && <EmailInput/>}
              {step === SignInSteps.VERIFY_OTP && <VerifyCode/>}
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5D5EE2'
  },
  backgroundImage: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    padding: 32,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
  },
})

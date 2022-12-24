import React, { useState } from 'react'
import { Alert, Button as BackButton, StyleSheet, View } from 'react-native'
import { supabase } from '../../supabase/supabase'
import { Button, Input } from 'react-native-elements'
import Logo from "../../components/common/Logo";
import { useGetUniversities } from "../../hooks/query";
import { useNavigation } from "@react-navigation/native";

export default function SignInScreen({ route }) {
  const { selectedUniversityId } = route.params;
  console.log('selectedUniversityId : ', selectedUniversityId)
  const {
    isLoading: teamIsLoading,
    isError: teamIsError,
    data: universities,
    error: teamError,
  } = useGetUniversities();
  const navigation = useNavigation();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true);

    // check if profile exists

    // check if profile belongs to university

    // check if profile is froshee/leader
    

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false);
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
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
        <BackButton
          title="Back"
          onPress={() => navigation.navigate('Select University')}
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

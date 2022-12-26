import React from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { useGetUniversities } from "../../hooks/query";
import SelectDropdown from 'react-native-select-dropdown'
import { useNavigation } from "@react-navigation/native";
import Logo from "../../components/common/Logo";
import useSignIn from "../../hooks/useSignIn";
import { SignInScreenNames, SignInStackParamList } from "../../@types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginVertical: 32,
  },
  header: {
    fontSize: 24,
    marginVertical: 16,
  },
  dropdown: {
    marginVertical: 16
  },
});


export default function UniversitySelectScreen() {
  const {
    isLoading: teamIsLoading,
    isError: teamIsError,
    data: universities,
    error: teamError,
  } = useGetUniversities();
  const { dropdownRef, selectedUniversityId, setSelectedUniversityId } = useSignIn();
  const navigation = useNavigation<StackNavigationProp<SignInStackParamList>>();

  const extractUniversityName = (university: Record<string, any>) => university.name;

  const extractUniversityId = (university: Record<string, any>) => university.id;

  const handleUniversitySelect = (selectedUniversity: Record<string, any>) =>
    setSelectedUniversityId(extractUniversityId(selectedUniversity));

  const handleNextPress = () => {
    navigation.navigate(SignInScreenNames.EMAIL_INPUT);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Logo/>
      <SelectDropdown
        ref={dropdownRef as any}
        data={universities}
        onSelect={handleUniversitySelect}
        defaultValue=''
        buttonTextAfterSelection={extractUniversityName}
        rowTextForSelection={extractUniversityName}
        defaultButtonText='Select your university'
        buttonStyle={styles.dropdown}
      />
      <Button
        title="Next"
        onPress={handleNextPress}
        disabled={selectedUniversityId === ''}
      />
    </SafeAreaView>
  )
}

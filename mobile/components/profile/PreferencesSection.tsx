import * as React from 'react';
import { Fragment } from 'react';
import { FAB, Text } from 'react-native-paper';
import usePreferences from "../../hooks/usePreferences";
import { commonStyles } from "./Common.styles";
import { View } from "react-native";

export default function PreferencesSection() {
  const { toggleTheme } = usePreferences();

  return (
    <Fragment>
      <Text style={commonStyles.title}>Preferences</Text>
      <View style={{ flexDirection: 'row' }}>
        <FAB icon="theme-light-dark" onPress={toggleTheme}/>
      </View>
    </Fragment>
  );
}

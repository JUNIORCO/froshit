import { ImageBackground, StyleSheet, View } from "react-native";
import Logo from "./Logo";
import ThreeDotsLoader from "../ThreeDotsLoader";
import React from "react";
import useTheme from "../../hooks/useTheme";

export default function SplashImage() {
  const theme = useTheme();

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.surface
    }}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
      >
        <View style={{
          padding: 32,
          width: '80%',
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
          alignItems: 'center',
        }}>
          <Logo width={250} height={125}/>
          <ThreeDotsLoader/>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

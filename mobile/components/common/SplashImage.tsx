import { ImageBackground, View, StyleSheet } from "react-native";
import Logo from "./Logo";
import ThreeDotsLoader from "../ThreeDotsLoader";
import React from "react";

export default function SplashImage() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.innerContainer}>
          <Logo width={170} height={80}/>
          <ThreeDotsLoader/>
        </View>
      </ImageBackground>
    </View>
  );
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
    opacity: 0.95,
    borderRadius: 16,
    alignItems: 'center',
  },
})

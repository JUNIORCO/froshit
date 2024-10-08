import React, { ReactElement } from "react";
import { ImageBackground, ImageSourcePropType, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import Logo from "../components/common/Logo";
import { Card } from "react-native-paper";
import { useRefetchByUser } from "../hooks/useRefetchByUser";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    height: '100%',
  },
  innerContainer: {
    margin: 16,
    marginTop: 64,
  }
});

type Props = {
  wrapView: boolean;
  background: ImageSourcePropType;
  component: ReactElement;
}

// wrap view temporary until Chat works without the check
export default function ScreenLayout({ wrapView, background, component }: Props) {
  const { isRefetchingByUser, refetchByUser } = useRefetchByUser();

  const refreshControl = <RefreshControl
    refreshing={isRefetchingByUser}
    onRefresh={refetchByUser}
  />;

  return (
    <View style={styles.container}>
      <ImageBackground source={background} style={styles.backgroundImage}>
        {wrapView ?
          <ScrollView refreshControl={refreshControl} keyboardShouldPersistTaps='always'>
            <View style={styles.innerContainer}>
              <Card style={{ padding: 16, borderRadius: 16, marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Logo/>
                  <Logo university/>
                </View>
              </Card>
              {component}
            </View>
          </ScrollView> : component}
      </ImageBackground>
    </View>);
}

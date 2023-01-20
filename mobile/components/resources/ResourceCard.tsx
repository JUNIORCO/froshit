import * as React from 'react';
import { Card } from 'react-native-paper';
import { Linking, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default function ResourceCard({ title, description, phoneNumber, email }: any) {
  const handlePhonePress = () => Linking.openURL(`tel:${phoneNumber}`);

  const handleEmailPress = () => Linking.openURL(`mailto:${email}`);

  const RightContent = () => (
    <View style={{ flexDirection: 'row' }}>
      {email && <Feather name="mail" size={32} onPress={handleEmailPress} style={{ marginRight: 16 }}/>}
      {phoneNumber && <Feather name="phone-call" size={32} onPress={handlePhonePress} color='#25D366'/>}
    </View>
  );

  return (
    <Card style={styles.container}>
      <Card.Title
        title={title}
        subtitle={description}
        subtitleNumberOfLines={6}
        right={RightContent}
        style={{ padding: 16 }}
      />
    </Card>
  );
}

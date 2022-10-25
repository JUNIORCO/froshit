import { StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    borderRadius: 12,
    backgroundColor: '#f9c2ff',
    paddingHorizontal: 24,
    paddingVertical: 48,
    marginVertical: 32,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
});

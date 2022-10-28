import { StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  item: (selected: boolean) => ({
    borderRadius: 8,
    backgroundColor: selected ? '#e91e63' : 'grey',
    paddingHorizontal: 18,
    paddingVertical: 32,
    alignItems: 'center',
  }),
  title: {
    fontSize: 16,
  },
});

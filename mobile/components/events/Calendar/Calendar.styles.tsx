import { StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  item: (selected: boolean) => ({
    borderRadius: 16,
    backgroundColor: selected ? '#e91e63' : 'grey',
    paddingHorizontal: 16,
    paddingVertical: 32,
    marginVertical: 24,
    alignItems: 'center',
  }),
  title: {
    fontSize: 16,
  },
});

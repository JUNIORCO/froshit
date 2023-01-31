import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  item: (backgroundColor) => ({
    borderRadius: 8,
    backgroundColor: backgroundColor,
    paddingHorizontal: 12,
    paddingVertical: 36,
    alignItems: 'center',
    width: 76,
  }),
  title: {
    fontSize: 32,
    marginVertical: 16,
    fontWeight: 'bold',
  },
  data: {
    fontSize: 16,
  }
});

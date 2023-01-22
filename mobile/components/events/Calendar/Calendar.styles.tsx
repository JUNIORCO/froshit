import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  item: (backgroundColor) => ({
    borderRadius: 8,
    backgroundColor: backgroundColor,
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
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

import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');
const dim = (width) / 2.1 * 0.93;

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    height: '100%',
  },
  title: {
    fontSize: 32,
    marginVertical: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  square: {
    width: dim * 0.9,
    height: dim * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    borderRadius: 16,
    margin: 8,
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'space-between',
  }
});

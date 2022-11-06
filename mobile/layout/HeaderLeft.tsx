import Ionicons from '@expo/vector-icons/Ionicons';

export default function HeaderLeft(props) {
  return (
    <Ionicons
      name='cog-outline'
      color='white'
      size={32}
      style={{ marginLeft: 16 }}
      {...props}
    />
  );
}

import Ionicons from '@expo/vector-icons/Ionicons';

export default function HeaderRight(props) {

  return (
    <Ionicons
      name='person-circle-outline'
      color='white'
      size={32}
      style={{ marginRight: 16 }}
      {...props}
    />
  );
}

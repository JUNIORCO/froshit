import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from "../supabase/supabase";

export default function HeaderRight(props: any) {
  return (
    <Ionicons
      name='person-circle-outline'
      color='white'
      size={32}
      style={{ marginRight: 16 }}
      onPress={() => supabase.auth.signOut()}
      {...props}
    />
  );
}

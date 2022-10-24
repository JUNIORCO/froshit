import { Button, View } from "react-native";
import { supabase } from "../supabase/supabase";
import { SUPABASE_COLUMNS } from "../supabase/columns";
import { useState } from "react";

export default function EventsScreen() {
  const [users, setUsers] = useState<any>();

  const fetchUsers = async () => {
    try {
      const { data: users, count, error } = await supabase.from(SUPABASE_COLUMNS.PROFILE).select('*');
      console.log('get-users : ', users, count, error);
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Button title='Fetch' onPress={fetchUsers}/>
    </View>
  )
}

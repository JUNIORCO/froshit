import { Button, SafeAreaView } from "react-native";
import { supabase } from "../supabase/supabase";
import { SUPABASE_COLUMNS } from "../supabase/columns";
import { useState } from "react";
import Calendar from "../components/events/Calendar/Calendar";

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
    <SafeAreaView>
      <Calendar />
      <Button title='Fetch' onPress={fetchUsers}/>
    </SafeAreaView>
  )
}

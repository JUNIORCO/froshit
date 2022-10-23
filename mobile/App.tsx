import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { supabase } from './supabase/supabase';
import Auth from './components/Auth';
import Account from './components/Account';
import { Button, View } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { SUPABASE_COLUMNS } from "./supabase/columns";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [users, setUsers] = useState<any>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

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
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
      <Button title='Fetch' onPress={fetchUsers} />
    </View>
  );
}

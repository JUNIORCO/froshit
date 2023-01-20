import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Chat, MessageType } from '../components/chat'
import useSession from "../hooks/useSession";
import { uuid } from "@supabase/supabase-js/dist/main/lib/helpers";
import { supabase } from "../supabase/supabase";
import { useGetMessages } from "../hooks/query";
import { formatMessage } from "../helpers/messageFormatter";
import { Tables } from "../supabase/extended.types";
import { Database } from "../supabase/database.types";

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
    fontSize: 24,
    marginVertical: 16,
  },
});

export default function ChatScreen() {
  const {
    isLoading: eventsIsLoading,
    isError: eventsIsError,
    data: messages,
    error: eventsError,
    refetch: refetchMessages,
  } = useGetMessages();

  const { profile } = useSession();
  const user = { id: profile!.id };
  console.log('user : ', user)
  const [displayedMessages, setDisplayedMessages] = useState<MessageType.Text[]>([]);
  console.log(displayedMessages[0])
  useEffect(() => {
    if (messages) {
      setDisplayedMessages(messages);
    }
  }, [messages])


  const channel = supabase.channel('messages');

  const handleSendPress = async (message: MessageType.PartialText) => {
    const { data, error } = await supabase.from(Tables.message).insert({
      id: uuid(),
      teamId: profile!.teamId,
      profileId: profile!.id,
      content: message.text,
      profileFirstName: profile!.firstName,
      profileLastName: profile!.lastName,
      profileImageUrl: profile!.imageUrl || '',
      profileRole: profile!.role,
    });
    console.log('[realtime] handle send press: error', error)
  }

  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'message',
      filter: `teamId=eq.${profile!.teamId}`,
    },
    (payload) => {
      console.log('[realtime] new message receievd! s', payload.new)
      const formattedMessage: MessageType.Text = formatMessage(payload.new as Database['public']['Tables']['message']['Row']);
      console.log('[realtime] formattedMessage : ', formattedMessage)
      setDisplayedMessages((prev) => [formattedMessage, ...prev]);
    }
  )

  channel.subscribe(async (status) => {
    console.log('[realtime] status : ', status)
    // if (status === 'SUBSCRIBED') {
    // }
  })

  return (
    <Chat
      messages={displayedMessages}
      onSendPress={handleSendPress}
      user={user}
      showUserAvatars
      showUserNames
      enableAnimation
      timeFormat='h:m a'
    />
  )
}

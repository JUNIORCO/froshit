import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Chat, MessageType } from '../components/chat'
import useSession from "../hooks/useSession";
import { uuid } from "@supabase/supabase-js/dist/main/lib/helpers";
import { supabase } from "../supabase/supabase";
import { useGetMessages } from "../hooks/query";
import { formatMessage } from "../helpers/messageFormatter";
import { Message } from "../@types/message";
import { Tables } from "../supabase/columns";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    height: '100%',
  },
  title: {
    fontSize: 24,
    marginVertical: 16,
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
  const [displayedMessages, setDisplayedMessages] = useState<MessageType.Text[]>([]);

  useEffect(() => {
    if (messages) {
      setDisplayedMessages(messages);
    }
  }, [messages])


  const channel = supabase.channel('messages');

  const handleSendPress = async (message: MessageType.PartialText) => {
    const { data, error } = await supabase.from(Tables.MESSAGE).insert({
      id: uuid(),
      teamId: profile!.teamId,
      profileId: profile!.id,
      content: message.text,
      profileFirstName: profile!.firstName,
      profileLastName: profile!.lastName,
      profileImageUrl: profile!.imageUrl || '',
      profileRole: profile!.role,
    })
    console.log(error)
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
      console.log('[realtime] new message receievd!')
      const formattedMessage: MessageType.Text = formatMessage(payload.new as Message);
      console.log('[realtime] formattedMessage : ', formattedMessage)
      setDisplayedMessages((prev) => [formattedMessage, ...prev]);
    }
  )

  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      console.log('subscribed!');
    }
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

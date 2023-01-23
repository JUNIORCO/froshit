import React, { useCallback, useEffect, useState } from 'react';
import useSession from "../hooks/useSession";
import { uuid } from "@supabase/supabase-js/dist/main/lib/helpers";
import { supabase } from "../supabase/supabase";
import { useGetMessages } from "../hooks/query";
import { formatMessage } from "../helpers/messageFormatter";
import { Tables } from "../supabase/extended.types";
import { Database } from "../supabase/database.types";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useSession();
  const {
    isLoading: eventsIsLoading,
    isError: eventsIsError,
    data: messages,
    error: eventsError,
    refetch: refetchMessages,
  } = useGetMessages();

  const [displayedMessages, setDisplayedMessages] = useState<IMessage[]>([]);

  const chatUser = { _id: profile.id };

  const onSend = useCallback(async (messages: IMessage[] = []) => {
    const message = messages[0];
    if (!message) return;

    const { error } = await supabase.from(Tables.message).insert({
      id: uuid(),
      teamId: profile.teamId,
      profileId: profile.id,
      content: message.text,
      profileFirstName: profile.firstName,
      profileLastName: profile.lastName,
      profileImageUrl: profile.imageUrl || '',
      profileRole: profile.role,
    });
  }, []);


  /*
  *
  * Supabase logic
  *
  * */
  const channel = supabase.channel('messages');

  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'message',
      filter: `teamId=eq.${profile.teamId}`,
    },
    (payload) => {
      const formattedMessage: IMessage = formatMessage(payload.new as Database['public']['Tables']['message']['Row']);
      setDisplayedMessages((prev) => [formattedMessage, ...prev]);
    }
  )

  channel.subscribe(async (status) => {
    // if (status === 'SUBSCRIBED') {
    // }
  });

  useEffect(() => {
    if (messages) {
      setDisplayedMessages(messages);
    }
  }, [messages]);

  return (
    <GiftedChat
      messages={displayedMessages}
      onSend={onSend}
      user={chatUser}
      renderUsernameOnMessage
      maxInputLength={280}
      wrapInSafeArea={false}
    />
  )
}

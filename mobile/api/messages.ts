import { QueryFunctionContext } from "@tanstack/react-query";
import { db } from "../supabase/db";
import { formatMessage } from "../helpers/messageFormatter";
import { IMessage } from "react-native-gifted-chat/lib/Models";

type QueryKeyArg = {
  teamId: string;
}

export const fetchMessages = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>): Promise<IMessage[]> => {
  const [_key, { teamId }] = queryKey;

  const { data: messages, error: getMessagesError } = await db.message.getMessagesByTeamId(teamId)

  if (getMessagesError) throw getMessagesError;

  if (!messages) return [];

  return messages.map(formatMessage);
}

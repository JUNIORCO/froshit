import { QueryFunctionContext } from "@tanstack/react-query";
import type { MessageType } from "../components/chat";
import { formatMessage } from "../helpers/messageFormatter";
import { db } from "../supabase/db";

type QueryKeyArg = {
  teamId: string;
}

export const fetchMessages = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>): Promise<MessageType.Text[]> => {
  const [_key, { teamId }] = queryKey;

  const { data: messages, error: getMessagesError } = await db.message.getMessagesByTeamId(teamId)

  if (getMessagesError) throw getMessagesError;

  if (!messages) return [];

  return messages.map(formatMessage);
}

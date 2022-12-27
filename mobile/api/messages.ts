import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";
import { QueryFunctionContext } from "@tanstack/react-query";
import type { MessageType } from "../components/chat";
import { formatMessage } from "../helpers/messageFormatter";

type QueryKeyArg = {
  teamId: string;
}

export const fetchMessages = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>): Promise<MessageType.Text[]> => {
  const [_key, { teamId }] = queryKey;
  console.log(`[Messages] api -> Fetching messages for team ${teamId}...`);
  const { data: messages, error } = await supabase
    .from(Tables.MESSAGE)
    .select('*')
    .eq('teamId', teamId)
    .order('createdAt', { ascending: false });

  if (!messages || error) {
    console.error(`api -> fetchMessages errored ${error!.message}`);
    throw error;
  }

  return messages.map(formatMessage);
}

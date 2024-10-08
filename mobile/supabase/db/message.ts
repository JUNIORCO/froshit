import { supabase } from "../supabase";
import { Message, Tables } from "../types/extended";

export class _Message {
  public static getMessagesByTeamId = async (teamId: string) =>
    supabase.from<typeof Tables.message, Message>(Tables.message)
      .select('*')
      .eq('teamId', teamId)
      .order('createdAt', { ascending: false })
      .limit(100);
}

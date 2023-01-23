import { supabase } from "../supabase";
import { Profile, Tables } from "../types/extended";

export class _Team {
  public static getTeamMembers = async (teamId: string) =>
    supabase
      .from<typeof Tables.profile, Profile>(Tables.profile)
      .select('*, teamId (*)')
      .eq('teamId', teamId)
      .order('firstName', { ascending: true });
}


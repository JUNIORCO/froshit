import { supabase } from "../supabase";
import { Profile, Tables } from "../extended.types";

export class _Team {
  public static getTeamMembers = async (teamId: string) =>
    supabase
      .from<typeof Tables.profile, Profile>(Tables.profile)
      .select('*, teamId (name)')
      .eq('teamId', teamId)
      .order('firstName', { ascending: true });
}


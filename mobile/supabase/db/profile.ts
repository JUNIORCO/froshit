import { supabase } from "../supabase";
import { Profile, Tables } from "../extended.types";

export class _Profile {
  public static getProfileByEmail = async (email: string) =>
    supabase.from<typeof Tables.profile, Profile>(Tables.profile)
      .select('*, university (id, subdomain)')
      .eq('email', email)
      .single();

  public static getLoggedInProfile = async (userId: string) =>
    supabase.from<typeof Tables.profile, Profile>(Tables.profile)
      .select('*, team(*), university(*)')
      .eq('id', userId)
      .single();

  public static updateProfile = async (id: string, {
    interests,
    phoneNumber
  }: Pick<Profile['Update'], 'interests' | 'phoneNumber'>) =>
    supabase
      .from<typeof Tables.profile, Profile>(Tables.profile)
      .update({ interests, phoneNumber })
      .match({ id })
}


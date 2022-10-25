import { supabase } from "../supabase/supabase";
import { SUPABASE_COLUMNS } from "../supabase/columns";

export const getEvents = async () => {
  try {
    const { data: users, error } = await supabase.from(SUPABASE_COLUMNS.PROFILE).select('*');

    if (error) {
      throw error;
    }

    return users;
  } catch (error) {
    console.error(`Error in getEvents, ${error}`);
    throw error;
  }
}

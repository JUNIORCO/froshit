import { supabase } from "../supabase/supabase";
import { TABLES } from "../supabase/columns";

export const getEvents = async () => {
  try {
    const { data: users, error } = await supabase.from(TABLES.Profile).select('*');

    if (error) {
      throw error;
    }

    return users;
  } catch (error) {
    console.error(`Error in events.getEvents, ${error}`);
    throw error;
  }
}

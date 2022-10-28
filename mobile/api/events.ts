import { supabase } from "../supabase/supabase";
import { TABLES } from "../supabase/columns";

export const getEvents = async (callback) => {
  try {
    const { data: users, error } = await supabase.from(TABLES.Event).select('*');

    if (error) {
      throw error;
    }

    callback(users);
  } catch (error) {
    console.error(`Error in events.getEvents, ${error.message}`);
    throw error;
  }
}

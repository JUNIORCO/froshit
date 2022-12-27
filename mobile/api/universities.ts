import { supabase } from "../supabase/supabase";
import { Tables } from "../supabase/columns";

export const fetchUniversities = async (): Promise<any> => {
  console.log(`fetchUniversitiesApi -> Fetching universities`)

  const {
    data: universities,
    error
  } = await supabase
    .from(Tables.UNIVERSITY)
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error(`fetchUniversitiesApi -> ${error.message}`);
    throw error;
  }

  return universities;
}

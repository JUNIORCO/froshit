import { supabase } from "../supabase";
import { Resource, Tables } from "../types/extended";

export class _Resource {
  public static getResources = async (universityId: string) =>
    supabase.from<typeof Tables.resource, Resource>(Tables.resource)
      .select('*, resourceTagId (id, name, imageUrl)')
      .eq('universityId', universityId);
}


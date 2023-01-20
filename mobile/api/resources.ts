import { QueryFunctionContext } from "@tanstack/react-query";
import { db } from "../supabase/db";

type QueryKeyArg = {
  universityId: string;
}

export const fetchResources = async ({ queryKey }: QueryFunctionContext<[string, QueryKeyArg]>) => {
  const [_key, { universityId }] = queryKey;

  const { data: resources, error: getResourcesError } = await db.resource.getResources(universityId);

  if (getResourcesError) throw getResourcesError;

  return resources;
}

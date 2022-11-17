import { prisma } from '..';
import type { Resource, ResourceTag } from '../types';

/**
 * Gets all resources with tag.
 */
export type FullResource = Resource & { resourceTag: ResourceTag };

export const getResources = async (): Promise<FullResource[]> => prisma.resource.findMany({
  include: {
    resourceTag: true,
  },
});

/**
 * Gets resource by id.
 */
export const getResourceById = async (id: string): Promise<FullResource> => prisma.resource.findUniqueOrThrow({
  where: {
    id,
  },
  include: {
    resourceTag: true,
  },
});

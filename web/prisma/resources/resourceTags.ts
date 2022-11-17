import { prisma } from '..';
import type { ResourceTag } from '../types';

/**
 * Gets all resource tags.
 */
export const getResourceTags = async (): Promise<ResourceTag[]> => prisma.resourceTag.findMany();

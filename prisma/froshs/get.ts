import { prisma } from '..';
import type { Frosh } from '../types';

/**
 * Gets all the Froshs.
 */
export const getFroshs = async (): Promise<Frosh[]> => prisma.frosh.findMany();

import { prisma } from '..';
import type { Program } from '../types';

/**
 * Gets all the Programs for a university.
 */
export const getPrograms = async (): Promise<Program[]> => prisma.program.findMany();

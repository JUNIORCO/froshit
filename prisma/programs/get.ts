import { prisma } from '../index';

/**
 * Gets all the user.
 */
export const getPrograms = async () => prisma.program.findMany();

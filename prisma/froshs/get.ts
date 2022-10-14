import { prisma } from '../index';

/**
 * Gets all the user.
 */
export const getFroshs = async () => prisma.frosh.findMany({});

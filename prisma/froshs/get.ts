import { prisma } from '../index';

/**
 * Gets all the users.
 */
export const getFroshs = async () => prisma.frosh.findMany({
  select: {
    id: true,
    name: true,
  },
});

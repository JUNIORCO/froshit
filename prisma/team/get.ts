import { prisma } from '../index';

/**
 * Gets all the users.
 */
export const getTeams = async () => prisma.team.findMany({
  select: {
    id: true,
    name: true,
  },
});

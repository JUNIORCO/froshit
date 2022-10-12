import { prisma } from '../index';

/**
 * Gets all the users.
 */
export const getPrograms = async () => prisma.program.findMany({
  select: {
    id: true,
    name: true,
    universityId: true,
  },
});

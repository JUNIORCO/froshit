import { prisma } from '../index';

/**
 * Gets a user by id.
 */
export const getUserById = async (id: number) => prisma.profile.findUniqueOrThrow({
  where: {
    id,
  },
  include: {
    program: true,
    frosh: true,
    team: true,
  }
});

/**
 * Gets all the user.
 */
export const getUsersForAdminList = async () => prisma.profile.findMany({
  include: {
    frosh: true,
    team: true,
  },
});

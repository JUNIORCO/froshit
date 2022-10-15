import { prisma } from '../index';

/**
 * Gets all the user.
 */
export const getUsersForAdminList = async () => prisma.profile.findMany({
  include: {
    frosh: true,
    team: true,
  },
});

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
  },
});

/**
 * Gets all Froshees and Leaders that are unassigned to a team.
 */
export const getFrosheesAndLeadersWithNoTeam = async () => prisma.profile.findMany({
  where: {
    teamId: null,
    role: {
      in: ['Froshee', 'Leader'],
    },
  },
  include: {
    frosh: true,
  },
});

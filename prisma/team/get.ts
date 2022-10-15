import { prisma } from '../index';

/**
 * Gets all the teams.
 */
export const getTeams = async () => prisma.team.findMany();

/**
 * Gets all the teams and the teams Frosh.
 */
export const getTeamsWithFrosh = async () => prisma.team.findMany({
  include: {
    frosh: true,
    profiles: true,
  }
});

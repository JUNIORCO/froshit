import { prisma } from '..';
import type { Frosh, Profile, Team } from '../types';

/**
 * Gets all the teams.
 */
export const getTeams = async (): Promise<Team[]> => prisma.team.findMany();

/**
 * Gets a team by id.
 */
export type FullTeam = Team & { profiles: Profile[] | null, frosh: Frosh | null };

export const getTeamById = async (id: number): Promise<FullTeam> => prisma.team.findUniqueOrThrow({
  where: {
    id,
  },
  include: {
    frosh: true,
    profiles: true,
  },
});

/**
 * Gets all the teams and the teams Frosh.
 */
export const getTeamsWithFrosh = async (): Promise<FullTeam[]> => prisma.team.findMany({
  include: {
    frosh: true,
    profiles: true,
  },
});

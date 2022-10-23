import { prisma } from '..';
import { Role } from '../types';
import type { Frosh, Profile, Program, Team } from '../types';

/**
 * Gets all Users for user list.
 */
export type UsersForUserList = Profile & { frosh: Frosh | null, team: Team | null };

export const getUsersForUserList = async (): Promise<UsersForUserList[]> =>
  prisma.profile.findMany({
    include: {
      frosh: true,
      team: true,
    },
  });

/**
 * Gets a User by their id.
 */
export type FullUser = Profile & { frosh: Frosh | null, team: Team | null, program: Program | null };

export const getFullUserById = async (id: number): Promise<FullUser> => prisma.profile.findUniqueOrThrow({
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
export type UnassignedFrosheesAndLeaders = Profile & { frosh: Frosh | null };

export const getUnassignedFrosheesAndLeaders = async (): Promise<UnassignedFrosheesAndLeaders[]> => prisma.profile.findMany({
  where: {
    teamId: null,
    role: {
      in: [Role.Froshee, Role.Leader],
    },
  },
  include: {
    frosh: true,
  },
});

import { prisma, PrismaType } from '..';
import capitalize from 'lodash/capitalize';

/**
 * Gets all the users for a given admin
 */
export const getUsersForAdminList = async () => prisma.profile.findMany({
  select: {
    id: true,
    name: true,
    role: true,
    avatarUrl: true,
    program: true,
    interests: true,
    universityId: true,
    froshId: true,
    teamId: true,
  }
});

/**
 * Gets all roles in the database
 */
export const getUserRoles = async () => {
  const roles = await prisma.profile.findMany({
    distinct: ['role'],
    select: {
      role: true,
    },
  });
  return roles.map(({ role }: Record<string, string>) => capitalize(role));
};

export type UsersForAdminList = PrismaType.PromiseReturnType<typeof getUsersForAdminList>

export type UserRoles = PrismaType.PromiseReturnType<typeof getUserRoles>

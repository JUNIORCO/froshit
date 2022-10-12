import { prisma } from '../index';

/**
 * Gets a user by id.
 */
export const getUserById = async (id: number) => prisma.profile.findUniqueOrThrow({
  where: {
    id,
  },
  select: {
    id: true,
    name: true,
    email: true,
    phoneNumber: true,
    role: true,
    avatarUrl: true,
    interests: true,
    universityId: true,
    programId: true,
    froshId: true,
    teamId: true,
  },
});

/**
 * Gets all the users.
 */
export const getUsersForAdminList = async () => prisma.profile.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    phoneNumber: true,
    role: true,
    avatarUrl: true,
    universityId: true,
    froshId: true,
    teamId: true,
  },
});

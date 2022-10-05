import { prisma } from '../index';

/**
 * Gets all the users for a given admin
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

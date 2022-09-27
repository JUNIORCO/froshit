import { prisma, PrismaType } from '..';

export const getUsersForAdminList = async () => prisma.user.findMany({
  select: {
    id: true,
    name: true,
    role: true,
    universityId: true,
    froshId: true,
  }
});

export type UsersForAdminList = PrismaType.PromiseReturnType<typeof getUsersForAdminList>

import { Role } from '@prisma/client';

export const getProfileRoles = () => {
  return Object.values(Role);
}

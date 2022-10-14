import { Role } from '@prisma/client';

export const getProfileRoles = () => Object.values(Role)

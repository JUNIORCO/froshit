import { Interest } from '@prisma/client';

export const getProfileInterests = () => {
  return Object.values(Interest);
}

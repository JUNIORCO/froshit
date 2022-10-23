import { prisma } from '..';
import type { Frosh, Profile } from '../types';

/**
 * Gets all the Froshs.
 */
export const getFroshs = async (): Promise<Frosh[]> => prisma.frosh.findMany();

/**
 * Gets Frosh by id.
 */
export const getFroshById = async (id: number): Promise<Frosh> => prisma.frosh.findUniqueOrThrow({
  where: {
    id,
  }
});

/**
 * Gets all the Froshs with stats
 */
export type FroshsWithStats = Frosh & { profiles: Profile[], _count: { events: number, teams: number, } };

export const getFroshsWithStats = async (): Promise<FroshsWithStats[]> => prisma.frosh.findMany({
  include: {
    _count: {
      select: {
        events: true,
        teams: true,
      },
    },
    profiles: true,
  },
});

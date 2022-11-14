import { prisma } from '..';
import type { Frosh, Event } from '../types';

/**
 * Gets all the Events.
 */
export type FullEvent = Event & { frosh: Frosh };

export const getFullEvents = async (): Promise<FullEvent[]> => prisma.event.findMany({
  include: {
    frosh: true,
  }
});

/**
 * Gets a team by id.
 */
export const getEventById = async (id: string): Promise<FullEvent> => prisma.event.findUniqueOrThrow({
  where: {
    id,
  },
  include: {
    frosh: true,
  },
});

import { prisma } from '..';
import type { Offer } from '../types';

/**
 * Gets all the Offers for user
 */
type GetOffer = {
  id: number;
}

export const getOffers = async ({ id }: GetOffer): Promise<Offer[]> => prisma.offer.findMany();

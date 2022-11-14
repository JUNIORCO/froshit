import { prisma } from '..';
import type { Offer } from '../types';

/**
 * Gets all the Offers for user
 */
type GetOffer = {
  id: string;
}

export const getOffers = async ({ id }: GetOffer): Promise<Offer[]> => prisma.offer.findMany();

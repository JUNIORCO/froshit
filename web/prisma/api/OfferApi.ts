import { prisma } from '../prisma';
import { IChildApiOptions } from './AuthApi';
import { Offer, Profile } from '../types';

class OfferApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
  }

  public async getOfferById(id: string): Promise<Offer> {
    return prisma.offer.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
  }

  public async getOffers(): Promise<Offer[]> {
    return prisma.offer.findMany({
      where: {
        universityId: this.profile.universityId,
      },
    });
  }
}

export default OfferApi;

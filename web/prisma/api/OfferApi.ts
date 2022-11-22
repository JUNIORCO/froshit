import { prisma } from '../prisma';
import { IChildApiOptions } from './Api';
import { Offer, Profile } from '../types';

class OfferApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
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

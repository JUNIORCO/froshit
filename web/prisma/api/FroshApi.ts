import { prisma } from '../prisma';
import { FroshsWithStats } from './@types';
import { IChildApiOptions } from './AuthApi';
import { Frosh, Profile } from '../types';

class FroshApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
  }

  public async getFroshs(): Promise<Frosh[]> {
    return prisma.frosh.findMany({
      where: {
        universityId: this.profile.universityId,
      },
    });
  }

  public async getFroshById(id: string): Promise<Frosh> {
    return prisma.frosh.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  public async getFroshsWithStats(): Promise<FroshsWithStats[]> {
    return prisma.frosh.findMany({
      where: {
        universityId: this.profile.universityId,
      },
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
  }
}

export default FroshApi;

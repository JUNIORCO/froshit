import { prisma } from '../prisma';
import { FullEvent } from './@types';
import { IChildApiOptions } from './AuthApi';
import { Profile } from '../types';

class EventApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
  }

  public async getFullEvents(): Promise<FullEvent[]> {
    return prisma.event.findMany({
      where: {
        froshs: {
          some: {
            universityId: this.profile.universityId,
          },
        },
      },
      include: {
        froshs: true,
      },
    });
  }

  public async getEventById(id: string): Promise<FullEvent> {
    return prisma.event.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        froshs: true,
      },
    });
  }
}

export default EventApi;

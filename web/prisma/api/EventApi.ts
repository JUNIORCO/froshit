import { prisma } from '../prisma';
import { FullEvent } from './@types';
import { IChildApiOptions } from './Api';
import { Profile } from '../types';

class EventApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
  }

  public async getFullEvents(): Promise<FullEvent[]> {
    return prisma.event.findMany({
      where: {
        frosh: {
          universityId: this.profile.universityId,
        },
      },
      include: {
        frosh: true,
      },
    });
  }

  public async getEventById(id: string): Promise<FullEvent> {
    return prisma.event.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        frosh: true,
      },
    });
  }
}

export default EventApi;

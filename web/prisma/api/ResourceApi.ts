import { prisma } from '../prisma';
import { IChildApiOptions } from './AuthApi';
import { Profile, ResourceTag } from '../types';
import { FullResource } from './@types';

class ResourceApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
  }

  public async getResources(): Promise<FullResource[]> {
    return prisma.resource.findMany({
      where: {
        universityId: this.profile.universityId,
      },
      include: {
        resourceTag: true,
      },
    });
  }

  public async getResourceTags(): Promise<ResourceTag[]> {
    return prisma.resourceTag.findMany({
      where: {
        resources: {
          every: {
            universityId: this.profile.universityId,
          },
        },
      },
      include: {
        resources: true,
      },
    });
  }

  public async getResourceById(id: string): Promise<FullResource> {
    return prisma.resource.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        resourceTag: true,
      },
    });
  }

  public async getResourceTagById(id: string): Promise<ResourceTag> {
    return prisma.resourceTag.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }
}

export default ResourceApi;

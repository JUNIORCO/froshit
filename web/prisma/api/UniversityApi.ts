import { prisma } from '../prisma';
import { IChildApiOptions } from './AuthApi';
import { Profile, University } from '../types';

class UniversityApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
  }

  public async getUniversity(): Promise<University> {
    return prisma.university.findUniqueOrThrow({
      where: {
        id: this.profile.universityId,
      },
    });
  }
}

export default UniversityApi;

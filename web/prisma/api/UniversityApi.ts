import { prisma } from '../prisma';
import { IChildApiOptions } from './Api';
import { Profile, University } from '../types';

class UniversityApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
  }

  public async getUniversities(): Promise<University[]> {
    return prisma.university.findMany();
  }
}

export default UniversityApi;

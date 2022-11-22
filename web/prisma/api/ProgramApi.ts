import { prisma } from '../prisma';
import { IChildApiOptions } from './AuthApi';
import { Profile, Program } from '../types';

class ProgramApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
  }

  public async getPrograms(): Promise<Program[]> {
    return prisma.program.findMany({
      where: {
        universityId: this.profile.universityId,
      },
    });
  }
}

export default ProgramApi;

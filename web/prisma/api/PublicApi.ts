import { Frosh, University } from '../types';
import { prisma } from '../prisma';

class PublicApi {
  constructor() {
  }

  public async getUniversityForFrosheeRegistration(subdomain: string): Promise<University & { froshs: Frosh[] }> {
    return prisma.university.findUniqueOrThrow({
      where: {
        subdomain,
      },
      include: {
        froshs: true,
      },
    });
  }
}

export default PublicApi;

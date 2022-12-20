import { University } from '../types';
import { prisma } from '../prisma';

class PublicApi {
  constructor() {
  }

  public async getUniversities(): Promise<University[]> {
    return prisma.university.findMany();
  }
}

export default PublicApi;

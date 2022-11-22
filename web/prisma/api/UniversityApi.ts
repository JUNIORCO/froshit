import { prisma } from '../prisma';
import { University } from '../types';

class UniversityApi {
  constructor() {
  }

  public async getUniversities(): Promise<University[]> {
    console.log('i bet we got all the way here')
    return prisma.university.findMany();
  }
}

export default UniversityApi;

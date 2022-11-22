import { prisma } from '../prisma';
import { University } from '../types';

class UniversityApi {
  public async getUniversities(): Promise<University[]> {
    return prisma.university.findMany();
  }
}

export default UniversityApi;

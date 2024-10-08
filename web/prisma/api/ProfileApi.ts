import { prisma } from '../prisma';
import { FullProfile, UnassignedFrosheesAndLeaders, UsersForUserList } from './@types';
import { IChildApiOptions } from './AuthApi';
import { Frosh, Profile, Role, Team } from '../types';

class ProfileApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
  }

  public async getProfilesForProfileList(): Promise<UsersForUserList[]> {
    return prisma.profile.findMany({
      where: {
        universityId: this.profile.universityId,
        role: Role.Froshee,
      },
      include: {
        frosh: true,
        team: true,
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async getOrganizersAndLeadersOnly(): Promise<(Profile & { frosh: Frosh | null, team: Team | null })[]> {
    return prisma.profile.findMany({
      where: {
        universityId: this.profile.universityId,
        role: {
          in: [Role.Organizer, Role.Leader],
        },
      },
      include: {
        frosh: true,
        team: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async getFullProfileById(id: string): Promise<FullProfile> {
    return prisma.profile.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        frosh: true,
        team: true,
        payment: true,
      },
    });
  }

  public async getUnassignedFrosheesAndLeaders(): Promise<UnassignedFrosheesAndLeaders[]> {
    return prisma.profile.findMany({
      where: {
        universityId: this.profile.universityId,
        teamId: null,
        role: {
          in: [Role.Froshee, Role.Leader],
        },
      },
      include: {
        frosh: true,
      },
    });
  }
}

export default ProfileApi;

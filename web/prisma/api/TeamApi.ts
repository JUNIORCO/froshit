import { prisma } from '../prisma';
import { FullTeam } from './@types';
import { IChildApiOptions } from './Api';
import { Profile, Team } from '../types';

class TeamApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
  }

  public async getTeams(): Promise<Team[]> {
    return prisma.team.findMany({
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

  public async getFullTeamById(id: string): Promise<FullTeam> {
    return prisma.team.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        frosh: true,
        profiles: true,
      },
    });
  }

  public async getTeamsWithFrosh(): Promise<FullTeam[]> {
    return prisma.team.findMany({
      where: {
        frosh: {
          universityId: this.profile.universityId,
        },
      },
      include: {
        frosh: true,
        profiles: true,
      },
    });
  }
}

export default TeamApi;

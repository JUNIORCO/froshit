import { prisma } from '../prisma';
import {
  Analytics,
  FormattedFroshProfileCount,
  FormattedGroupRole,
  FrosheesRegistered,
  FrosheesRegisteredAnalytics,
  FroshProfileCount,
  FroshTotalAmountCollected,
  GroupedRole,
} from './@types';
import { IChildApiOptions } from './AuthApi';
import { Prisma, Profile, Role, University } from '../types';
import dayjs from 'dayjs';
import { reverse, sumBy } from 'lodash';

class AnalyticsApi {
  protected readonly profile: Profile;

  constructor({ profile }: IChildApiOptions) {
    this.profile = profile;
  }

  private formatGroupedRoles = (groupedRoles: GroupedRole[]): FormattedGroupRole => groupedRoles.reduce((accum, groupedRole) => ({
    ...accum,
    [groupedRole.role]: groupedRole._count._all,
  }), {} as FormattedGroupRole);

  /**
   * Gets the number of users for each role
   */
  private async getRoleCounts(): Promise<FormattedGroupRole> {
    const groupedRoles = await prisma.profile.groupBy({
      by: ['role'],
      where: {
        universityId: this.profile.universityId,
      },
      _count: {
        _all: true,
      },
    });

    return this.formatGroupedRoles(groupedRoles);
  };

  private formatFroshProfileCount = (froshProfileCount: FroshProfileCount[]): FormattedFroshProfileCount[] => froshProfileCount.map(frosh => ({
    froshName: frosh.name,
    profileCount: frosh._count.profiles,
  }));

  /**
   * Gets the number of froshees in each froshs
   */
  private async getFroshProfilesCount({ role }: { role: Role }): Promise<FormattedFroshProfileCount[]> {
    const froshProfileCount = await prisma.frosh.findMany({
      where: {
        universityId: this.profile.universityId,
      },
      include: {
        _count: {
          select: {
            profiles: { where: { role } },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return this.formatFroshProfileCount(froshProfileCount);
  };

  /**
   * Gets the total amount collected per froshs
   */
  private async getFroshsTotalAmountCollected(): Promise<FroshTotalAmountCollected[]> {
    const froshTotalAmountCollected = await prisma.$queryRaw<FroshTotalAmountCollected[]>(
      Prisma.sql`
        SELECT frosh.name as "froshName", 
          SUM(CASE
              WHEN payment.type = 'Online' THEN payment.amount
              ELSE 0
           END) / 100 * 0.93 as "totalOnlineAmountCollected",
           SUM(CASE
              WHEN payment.type = 'Cash' THEN payment.amount
              ELSE 0
           END) / 100 as "totalCashAmountCollected"
        FROM frosh
        INNER JOIN profile ON frosh.id = profile."froshId"
        INNER JOIN payment ON profile."paymentId" = payment.id
        WHERE profile."universityId" = ${this.profile.universityId} 
          AND profile.role = 'Froshee'
          AND profile."paymentId" IS NOT NULL
        GROUP BY frosh.name
      `,
    );

    // Note: have to do this because of a bug in prisma where it returns big int instead of number for raw queries
    return froshTotalAmountCollected.map(result => ({
      ...result,
      totalOnlineAmountCollected: Number(result.totalOnlineAmountCollected),
      totalCashAmountCollected: Number(result.totalCashAmountCollected),
    }));
  };

  /**
   * Gets number of froshees registered in the past 7 days
   */
  private async getFrosheeRegistrationAnalytics(): Promise<FrosheesRegisteredAnalytics> {
    const frosheesRegistered = await prisma.profile.findMany({
      where: {
        universityId: this.profile.universityId,
        role: Role.Froshee,
        createdAt: {
          gte: dayjs().subtract(7, 'days').toDate(),
        },
        frosh: {
          isNot: null,
        },
      },
      include: {
        frosh: true,
      },
    });

    const dateTemplate = 'MMM D';
    const dates = reverse([...Array(7)].map((_, i) => dayjs().subtract(i, 'days').format(dateTemplate)));
    const dateMap = dates.reduce((map, date, index) => ({ ...map, [date]: index }), {} as Record<string, number>);

    const initialAccum = [{ froshName: 'All', data: Array(7).fill(0) }] as FrosheesRegistered[];

    const dailyData = frosheesRegistered.reduce((accum, froshee) => {
      // @ts-ignore
      const frosheeFroshName = froshee.frosh.name;
      const formattedFrosheeCreatedAt = dayjs(froshee.createdAt).format(dateTemplate) as string;
      const indexToAdd = dateMap[formattedFrosheeCreatedAt];

      const existingFroshIndex = accum.findIndex(({ froshName }) => froshName === frosheeFroshName);
      if (existingFroshIndex !== -1) {
        accum[existingFroshIndex].data[indexToAdd] += 1;
      } else {
        const initialArray = Array(7).fill(0);
        initialArray[indexToAdd] = 1;
        accum.push({ froshName: frosheeFroshName, data: initialArray });
      }

      // append to 'All'
      accum[0].data[indexToAdd] += 1;

      return accum;
    }, initialAccum);

    const prefixSum = (numbers: number[]) => {
      let pSum = 0;
      return numbers.map(x => pSum += x);
    };

    const cumulativeData = dailyData.map(({ froshName, data }) => ({
      froshName,
      data: prefixSum(data),
    }));

    return {
      dates,
      dailyData,
      cumulativeData,
    };
  };

  private async getUniversity(subdomain: string): Promise<University> {
    return prisma.university.findUniqueOrThrow({
      where: {
        subdomain,
      },
    });
  }

  public async getAnalyticsForDashboard(subdomain: string): Promise<Analytics> {
    const [
      universityResult,
      roleCountsResult,
      froshFrosheeCountResult,
      froshLeaderCountResult,
      froshsTotalAmountCollectedResult,
      frosheeRegistrationsResult,
    ] = await Promise.allSettled([
      this.getUniversity(subdomain),
      this.getRoleCounts(),
      this.getFroshProfilesCount({ role: Role.Froshee }),
      this.getFroshProfilesCount({ role: Role.Leader }),
      this.getFroshsTotalAmountCollected(),
      this.getFrosheeRegistrationAnalytics(),
    ]);

    const university = universityResult.status === 'fulfilled' ? universityResult.value : {} as University;
    const roleCounts = roleCountsResult.status === 'fulfilled' ? roleCountsResult.value : {} as FormattedGroupRole;
    const froshFrosheeCount = froshFrosheeCountResult.status === 'fulfilled' ? froshFrosheeCountResult.value : [] as FormattedFroshProfileCount[];
    const froshLeaderCount = froshLeaderCountResult.status === 'fulfilled' ? froshLeaderCountResult.value : [] as FormattedFroshProfileCount[];
    const froshsTotalAmountCollected = froshsTotalAmountCollectedResult.status === 'fulfilled' ? froshsTotalAmountCollectedResult.value : [] as FroshTotalAmountCollected[];
    const frosheesRegisteredAnalytics = frosheeRegistrationsResult.status === 'fulfilled' ? frosheeRegistrationsResult.value : {} as FrosheesRegisteredAnalytics;

    const sumByFunc = ({
                         totalOnlineAmountCollected,
                         totalCashAmountCollected,
                       }: FroshTotalAmountCollected) => totalOnlineAmountCollected + totalCashAmountCollected;

    return {
      university,

      totalAmountCollected: sumBy(froshsTotalAmountCollected, sumByFunc) || 0,

      // role counts
      totalOrganizers: roleCounts[Role.Organizer],
      totalLeaders: roleCounts[Role.Leader],
      totalFroshees: roleCounts[Role.Froshee],

      // froshs analytics
      froshFrosheeCount,
      froshLeaderCount,
      froshsTotalAmountCollected,

      // froshees registration analytics
      frosheesRegisteredAnalytics,
    };
  }
}

export default AnalyticsApi;

import type { Event, Frosh, Profile, Resource, ResourceTag, Team, Role, Payment } from '../types';

/** Event **/
export type FullEvent = Event & { frosh: Frosh };

/** Frosh **/
export type FroshsWithStats = Frosh & { profiles: Profile[], _count: { events: number, teams: number, } };

/** User **/
export type UsersForUserList = Profile & { frosh: Frosh | null, team: Team | null, payment: Payment | null };

export type FullProfile = Profile & { frosh: Frosh | null, team: Team | null };

export type UnassignedFrosheesAndLeaders = Profile & { frosh: Frosh | null };

/** Team **/
export type FullTeam = Team & { profiles: Profile[] | null, frosh: Frosh | null };

/** Resource **/
export type FullResource = Resource & { resourceTag: ResourceTag };

/** Analytics **/
export type GroupedRole = {
  _count: {
    _all: number;
  };
  role: Role;
}

export type FormattedGroupRole = Record<Role, number>;

export type FroshProfileCount = Frosh & { _count: { profiles: number } };

export type FormattedFroshProfileCount = { froshName: string; profileCount: number };

export type FroshTotalAmountPaid = { froshName: string; totalAmountPaid: number };

export type FrosheesRegistered = {
  froshName: string;
  data: number[];
};

export type FrosheesRegisteredAnalytics = {
  dates: string[];
  dailyData: FrosheesRegistered[];
  cumulativeData: FrosheesRegistered[];
};

export type Analytics = {
  totalAmountPaid: number;

  totalOrganizers: number;
  totalLeaders: number;
  totalFroshees: number;

  froshFrosheeCount: FormattedFroshProfileCount[];
  froshLeaderCount: FormattedFroshProfileCount[];
  froshsTotalAmountPaid: FroshTotalAmountPaid[];

  frosheesRegisteredAnalytics: FrosheesRegisteredAnalytics;
}

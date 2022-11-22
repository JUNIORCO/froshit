import { Event, Frosh, Profile, Program, Resource, ResourceTag, Team } from '../types';

/** Event **/
export type FullEvent = Event & { frosh: Frosh };

/** Frosh **/
export type FroshsWithStats = Frosh & { profiles: Profile[], _count: { events: number, teams: number, } };

/** User **/
export type UsersForUserList = Profile & { frosh: Frosh | null, team: Team | null };

export type FullProfile = Profile & { frosh: Frosh | null, team: Team | null, program: Program | null };

export type UnassignedFrosheesAndLeaders = Profile & { frosh: Frosh | null };

/** Team **/
export type FullTeam = Team & { profiles: Profile[] | null, frosh: Frosh | null };

/** Resource **/
export type FullResource = Resource & { resourceTag: ResourceTag };

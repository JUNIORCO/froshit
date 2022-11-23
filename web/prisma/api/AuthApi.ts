import { GetServerSidePropsContext } from 'next';
import type { Profile } from '../types';
import EventApi from './EventApi';
import FroshApi from './FroshApi';
import ProfileApi from './ProfileApi';
import TeamApi from './TeamApi';
import OfferApi from './OfferApi';
import ProgramApi from './ProgramApi';
import ResourceApi from './ResourceApi';
import UniversityApi from './UniversityApi';

export interface IApiOptions {
  ctx: GetServerSidePropsContext;
}

export interface IChildApiOptions {
  profile: Profile;
}

class AuthApi {
  public readonly Event: EventApi;
  public readonly Frosh: FroshApi;
  public readonly Profile: ProfileApi;
  public readonly Team: TeamApi;
  public readonly Offer: OfferApi;
  public readonly Program: ProgramApi;
  public readonly Resource: ResourceApi;
  public readonly Public: UniversityApi;

  constructor({ ctx }: IApiOptions) {
    const profile = ctx.req.headers.profile ? JSON.parse(<string>ctx.req.headers.profile) as Profile : null;
    if (!profile) {
      throw new Error('[AuthApi] No profile found.');
    }

    this.Event = new EventApi({ profile });
    this.Frosh = new FroshApi({ profile });
    this.Profile = new ProfileApi({ profile });
    this.Team = new TeamApi({ profile });
    this.Offer = new OfferApi({ profile });
    this.Program = new ProgramApi({ profile });
    this.Resource = new ResourceApi({ profile });
    this.Public = new UniversityApi();
  }
}

export default AuthApi;

import { FullProfile, UsersForUserList } from '../../prisma/api/@types';
import { Frosh, Team } from '../../prisma/types';

export type FrosheeTablePageProps = {
  users: UsersForUserList[];
  froshs: Frosh[];
}

export type NewFrosheeProps = {
  froshs: Frosh[];
  teams: Team[];
}

export type FrosheeEditViewProps = {
  froshee: FullProfile;
  froshs: Frosh[];
  teams: Team[];
}

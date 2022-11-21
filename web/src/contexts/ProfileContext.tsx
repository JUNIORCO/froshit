import { createContext, ReactNode, useMemo } from 'react';
import { FullUser } from '../../prisma/user/get';
// import { Frosh, Program, Team, Role } from '../../prisma/types';

// type Profile = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   role: Role;
//   paid: number | null;
//   interests: string[];
//   universityId: string;
//   programId: string | null;
//   froshId: string | null;
//   teamId: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   frosh: Frosh | null;
//   team: Team | null;
//   program: Program | null;
// };

export type ProfileContextProps = {
  profile: FullUser | null;
};

const initialState: ProfileContextProps = {
  profile: null,
};

const ProfileContext = createContext(initialState);

type ProfileProviderProps = {
  profile: FullUser | null;
  children: ReactNode;
};

function ProfileProvider({ profile, children }: ProfileProviderProps) {
  return (
    <ProfileContext.Provider
      value={{
        profile: useMemo(() => profile, [profile]),
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export { ProfileProvider, ProfileContext };

import { createContext, ReactNode } from 'react';
import { FullProfile } from '../../prisma/api/@types';

export type ProfileContextProps = {
  profile: FullProfile | null;
};

const initialState: ProfileContextProps = {
  profile: null,
};

const ProfileContext = createContext(initialState);

type ProfileProviderProps = {
  profile: FullProfile | null;
  children: ReactNode;
};

function ProfileProvider({ profile, children }: ProfileProviderProps) {
  return (
    <ProfileContext.Provider
      value={{
        profile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export { ProfileProvider, ProfileContext };

import { createContext, ReactNode } from 'react';
import { Session } from "@supabase/supabase-js";
import { LoggedInProfile } from "../supabase/types/extended";

export type ProfileContextProps = {
  session: Session;
  profile: LoggedInProfile;
}

const initialState: ProfileContextProps = {
  // @ts-ignore
  session: null,
  // @ts-ignore
  profile: null,
};

const SessionContext = createContext(initialState);

type ProfileProviderProps = {
  session: Session;
  profile: LoggedInProfile;
  children: ReactNode;
};

function SessionProvider({ session, profile, children }: ProfileProviderProps) {
  return (
    <SessionContext.Provider
      value={{
        session,
        profile,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export { SessionProvider, SessionContext };

import { createContext, ReactNode } from 'react';
import { Session } from "@supabase/supabase-js";
import { LoggedInProfile } from "../supabase/database.types";

export type ProfileContextProps = {
  session: Session | null;
  profile: LoggedInProfile | null;
}

const initialState: ProfileContextProps = {
  session: null,
  profile: null,
};

const SessionContext = createContext(initialState);

type ProfileProviderProps = {
  session: Session | null;
  profile: LoggedInProfile | null;
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

import { createContext, useState } from "react";
import { Session } from "@supabase/supabase-js";

export const SessionContext = createContext({
  session: {
    user: null
  },
  setSession: (session: Session | null) => {},
});

export default function SessionProvider({ children }: any) {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession
      }}>
      {children}
    </SessionContext.Provider>);
}

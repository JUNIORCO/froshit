import { createContext, ReactNode } from 'react';

export type SubdomainContextProps = {
  subdomain: string;
};

const initialState: SubdomainContextProps = {
  subdomain: '',
};

const SubdomainContext = createContext(initialState);

type SubdomainProviderProps = {
  subdomain: string;
  children: ReactNode;
};

function SubdomainProvider({ subdomain, children }: SubdomainProviderProps) {
  return (
    <SubdomainContext.Provider
      value={{
        subdomain,
      }}
    >
      {children}
    </SubdomainContext.Provider>
  );
}

export { SubdomainProvider, SubdomainContext };

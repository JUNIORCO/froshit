import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Login from '../pages/_subdomains/[subdomain]/auth/login';
import LoadingScreen from '../components/LoadingScreen';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { PATH_AUTH } from '../routes/paths';

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { isLoading, session } = useSessionContext();

  const { pathname, push } = useRouter();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      push(requestedLocation);
    }
    if (session?.user) {
      setRequestedLocation(null);
    }
  }, [session?.user, pathname, push, requestedLocation]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!session?.user) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
      push(PATH_AUTH.login);
    }
    return <Login />;
  }

  return <>{children}</>;
}

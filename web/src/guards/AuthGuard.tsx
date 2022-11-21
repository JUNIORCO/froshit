import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Login from '../pages/_subdomains/[subdomain]/auth/login';
import LoadingScreen from '../components/LoadingScreen';
import { useSession } from '@supabase/auth-helpers-react';

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const session = useSession();

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

  // if (!isInitialized) {
  //   return <LoadingScreen />;
  // }

  if (!session?.user) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  return <>{children}</>;
}

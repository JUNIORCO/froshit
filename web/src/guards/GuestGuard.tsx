import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../routes/paths';
import LoadingScreen from '../components/LoadingScreen';
import { useSession } from '@supabase/auth-helpers-react';

type Props = {
  children: ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { push } = useRouter();

  const session = useSession();

  useEffect(() => {
    if (session?.user) {
      push(PATH_DASHBOARD.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  // if (isInitialized === isAuthenticated) {
  //   return <LoadingScreen />;
  // }

  return <>{children}</>;
}

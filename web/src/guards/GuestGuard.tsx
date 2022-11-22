import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../routes/paths';
import LoadingScreen from '../components/LoadingScreen';
import { useSessionContext } from '@supabase/auth-helpers-react';

type Props = {
  children: ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { push } = useRouter();

  const { isLoading, session } = useSessionContext();

  useEffect(() => {
    if (session?.user) {
      push(PATH_DASHBOARD.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

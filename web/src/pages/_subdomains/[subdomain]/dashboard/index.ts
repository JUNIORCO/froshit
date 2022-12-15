import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// config
import { PATH_AFTER_LOGIN } from '../../../../config';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter();

  const getInternalPath = (pathname: string) => `/${pathname.split('/').pop()}`;

  useEffect(() => {
    if (getInternalPath(router.pathname) === PATH_DASHBOARD.root) {
      void router.replace(PATH_AFTER_LOGIN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  useEffect(() => {
    void router.prefetch(PATH_AFTER_LOGIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

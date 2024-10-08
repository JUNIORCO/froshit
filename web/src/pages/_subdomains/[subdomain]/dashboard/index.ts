import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { PATH_AFTER_LOGIN } from '../../../../config';
import { PATH_DASHBOARD } from '../../../../routes/paths';

export default function Index() {
  const router = useRouter();

  const getInternalPath = (pathname: string) => `/${pathname.split('/').pop()}`;

  useEffect(() => {
    if (getInternalPath(router.pathname) === PATH_DASHBOARD.root) {
      void router.replace(PATH_AFTER_LOGIN);
    }
  }, [router.pathname]);

  useEffect(() => {
    void router.prefetch(PATH_AFTER_LOGIN);
  }, []);

  return null;
}

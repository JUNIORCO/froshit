import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PATH_AFTER_LOGIN } from '../../../config';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (router.asPath == '/') {
      router.push(PATH_AFTER_LOGIN);
    }
  });

  return null;
}

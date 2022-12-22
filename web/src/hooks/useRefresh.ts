import { useRouter } from 'next/router';

export default function useRefresh() {
  const router = useRouter();

  const refreshData = () => {
    console.log('refreshing data...', router.asPath)
    void router.replace(router.asPath);
  };

  return {
    refreshData,
  };
}

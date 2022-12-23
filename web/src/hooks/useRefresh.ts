import { useRouter } from 'next/router';

export default function useRefresh() {
  const router = useRouter();

  const refreshData = () => {
    void router.replace(router.asPath);
  };

  return {
    refreshData,
  };
}

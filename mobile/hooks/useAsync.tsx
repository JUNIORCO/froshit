import { useEffect } from 'react';

export function useAsync<T>(asyncFn: any, onSuccess: any) {
  useEffect(() => {
    let isActive = true;

    asyncFn().then((data: T) => {
      if (isActive) onSuccess(data);
    });

    return () => { isActive = false };
  }, [asyncFn, onSuccess]);
}

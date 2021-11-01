import { useState, useEffect, useCallback } from 'react';

const useDebounce = (data: any, callback: () => any, timeout: number) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutId && clearTimeout(timeoutId);
    setTimeoutId(setTimeout(callback, timeout));
  }, [data, callback, setTimeoutId]);
};

export default useDebounce;
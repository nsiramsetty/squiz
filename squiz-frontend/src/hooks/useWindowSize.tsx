import { useCallback, useEffect, useState } from 'react';
import { useThrottle } from './useThrottle';

interface WindowSize {
  width?: number;
  height?: number;
}

const getWindowSize = () => ({
  height: window.innerHeight,
  width: window.innerWidth
});

export function useWindowSize(throttleInterval = 0) {
  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize());
  const updateWindowSize = useCallback(
    () => setWindowSize(getWindowSize()),
    []
  );

  const throttledSetWindowSize = useThrottle(
    updateWindowSize,
    throttleInterval
  );

  useEffect(() => {
    window.addEventListener('resize', throttledSetWindowSize);

    return () => window.removeEventListener('resize', throttledSetWindowSize);
  }, [throttledSetWindowSize]);

  return windowSize;
}

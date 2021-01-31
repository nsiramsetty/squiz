import { ThrottleSettings } from 'lodash';
import throttle from 'lodash/throttle';
import { useCallback, useEffect } from 'react';

export const useThrottle = <T extends (...args: any) => any>(
  callback: T,
  delay: number,
  options?: ThrottleSettings
) => {
  const throttled = useCallback(
    throttle(
      (...args: Parameters<T>): ReturnType<T> => callback(args),
      delay,
      options
    ),
    [delay, callback]
  );

  useEffect(() => {
    return throttled.cancel;
  });

  return throttled;
};

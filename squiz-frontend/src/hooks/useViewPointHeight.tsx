import { useCallback, useEffect, useState } from 'react';

const useViewPointHeight = () => {
  const [viewPointHeight, setViewPointHeight] = useState<string>('100vh');

  const getViewPointHeight = useCallback(() => {
    const vh = window.innerHeight * 0.01;
    setViewPointHeight(`${vh * 100}px`);
  }, []);

  useEffect(() => {
    getViewPointHeight();
    window.addEventListener('resize', getViewPointHeight);
    return () => window.removeEventListener('resize', getViewPointHeight);
  }, [getViewPointHeight]);

  return viewPointHeight;
};

export default useViewPointHeight;

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scroll80 = scrollPosition > 80;
  const scroll1k = scrollPosition > 1000;

  const handleScroll = () => {
    const position = window.pageYOffset;

    if (position > 80 && scrollPosition < 80) {
      setScrollPosition(position);
    }

    if (position < 80 && scrollPosition > 80) {
      setScrollPosition(position);
    }

    if (position > 1000 && scrollPosition < 1000) {
      setScrollPosition(position);
    }

    if (position < 1000 && scrollPosition > 1000) {
      setScrollPosition(position);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);

  return {
    scroll80,
    scroll1k
  };
}

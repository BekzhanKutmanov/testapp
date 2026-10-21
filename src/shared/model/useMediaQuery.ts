import { useState, useEffect } from 'react';

export function useMediaQuery(maxWidth: number | string): boolean {
  const query = typeof maxWidth === 'number' 
    ? `(max-width: ${maxWidth}px)` 
    : `(max-width: ${maxWidth})`;

  const getMatches = (queryString: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(queryString).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    setMatches(getMatches(query));

    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', documentChangeHandler);
    } else {
      mediaQueryList.addListener(documentChangeHandler);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', documentChangeHandler);
      } else {
        mediaQueryList.removeListener(documentChangeHandler);
      }
    };
  }, [query]);

  // Пока компонент не смонтирован на клиенте, возвращаем false (как на сервере)
  // Это предотвращает ошибку гидратации (HTML совпал)
  if (!isMounted) {
    return false;
  }

  return matches;
}

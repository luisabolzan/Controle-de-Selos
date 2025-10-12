// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Previne erros durante o Server-Side Rendering (SSR), onde `window` não existe.
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Ouve o evento 'change' que é disparado quando a condição da media query muda.
    mediaQueryList.addEventListener('change', handleChange);

    // Função de limpeza para remover o listener quando o componente for desmontado.
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]); // O efeito é re-executado se a string da query mudar.

  return matches;
}
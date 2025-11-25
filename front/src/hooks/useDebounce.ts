import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura um timer para atualizar o valor 'debounced' após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Se o valor mudar (usuário digitar) antes do delay acabar,
    // o timer anterior é limpo e um novo começa.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
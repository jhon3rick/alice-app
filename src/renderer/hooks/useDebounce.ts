import { useEffect, useState } from "react";

// Debounce para inputs (filtros y búsqueda)
export const useDebounce = <T,>(value: T, delayMs = 350) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
};

import { useCallback, useState } from 'react';

export default function useMutableRef<T>(value: T | null) {
  const [mutableRef, setMutableRef] = useState<T | null>(value);

  const setRef = useCallback((node: T) => {
    if (node) {
      setMutableRef(node);
    }
  }, []);
  return {
    setRef,
    mutableRef,
  };
}

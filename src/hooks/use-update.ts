import { useState, useCallback } from 'react';

export function useUpdate() {
  const [, setSate] = useState();
  const update = useCallback(() => {
    setSate(() => undefined);
  }, []);
  return update;
}

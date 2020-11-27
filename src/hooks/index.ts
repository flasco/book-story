import { useCallback, useEffect, useRef } from 'react';

export function useFuncRefCallback(cb: (...args: any[]) => any, dep: any[]) {
  const func = useRef<any>();
  const wrapper = useCallback(cb, dep);
  useEffect(() => (func.current = wrapper), [wrapper]);
  return func;
}

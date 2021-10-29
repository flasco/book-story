import { useEffect, useRef } from 'preact/compat';

export function useCallbackRef<T>(fn: T, deps: any[]) {
  const cb = useRef(fn);
  useEffect(() => {
    cb.current = fn;
  }, deps);

  return cb;
}

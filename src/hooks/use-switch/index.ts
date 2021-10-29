import { useState, useCallback } from 'preact/compat';

const useSwitch = (initVal = false) => {
  const [open, setOpen] = useState(initVal);

  const changeOpen = useCallback(() => setOpen(val => !val), [setOpen]);
  return [open, changeOpen] as const;
};

export default useSwitch;

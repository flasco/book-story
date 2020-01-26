import { useState, useCallback } from 'react';

const useSwitch = (initVal = false) => {
  const [open, setOpen] = useState(initVal);

  const changeOpen = useCallback(() => setOpen(val => !val), [setOpen]);
  return [open, changeOpen] as [boolean, () => void];
};

export default useSwitch;

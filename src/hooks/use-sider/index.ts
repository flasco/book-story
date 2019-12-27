import { useState, useCallback } from 'react';

const useDrawer = () => {
  const [open, setOpen] = useState(false);

  const changeOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);
  return [open, changeOpen] as [boolean, () => void];
};

export default useDrawer;

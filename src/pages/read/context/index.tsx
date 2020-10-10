import React, { useContext } from 'react';

import useReader from '../hook/use-reader';

type ContextValue = ReturnType<typeof useReader>;

const ReaderContext = React.createContext({} as ContextValue);

const ContextWrapper: React.FC<any> = ({ children, bookInfo }) => {
  const value = useReader(bookInfo);

  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>;
};

export const useReaderContext = () => {
  return useContext(ReaderContext);
};

export default ContextWrapper;

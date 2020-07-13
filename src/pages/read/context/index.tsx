import React, { useMemo, useContext } from 'react';

import useReader, { TReader } from '../hook/use-reader';
import { createModel } from 'hox';

const ReaderContext = React.createContext({} as TReader);

const ContextWrapper: React.FC<any> = ({ children, catalogUrl }) => {
  const useSlefReader = useMemo(() => createModel(useReader, catalogUrl), [catalogUrl]);
  const value = useSlefReader();

  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>;
};

export const useReaderContext = () => {
  return useContext(ReaderContext);
};

export default ContextWrapper;

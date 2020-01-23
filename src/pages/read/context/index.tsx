import React, { useMemo, useContext } from 'react';

import useReader from '../hook/use-reader';

interface ContextValue {
  title: string;
  pages: string[];
  watched: number;
  showMenu: boolean;
  changeMenu: () => void;
  nextChapter: () => Promise<boolean>;
  prevChapter: () => Promise<boolean>;
  saveRecord: (currentChapter: any, page: any) => void;
}

const ReaderContext = React.createContext({} as ContextValue);

const ContextWrapper: React.FC<any> = ({ children, bookInfo }) => {
  const { api, ...states } = useReader(bookInfo);

  const value = useMemo(() => ({ ...api, ...states }), [
    states.pages,
    states.title,
    states.showMenu,
  ]);

  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>;
};

export const useReaderContext = () => {
  return useContext(ReaderContext);
};

export default ContextWrapper;

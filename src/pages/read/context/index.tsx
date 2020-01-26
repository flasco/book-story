import React, { useMemo, useContext } from 'react';

import useReader from '../hook/use-reader';
import ListCache from '@/cache/list';
import RecordCache from '@/cache/record';

interface ContextValue {
  title: string;
  pages: string[];
  watched: number;
  showMenu: boolean;
  cache: {
    list: ListCache;
    record: RecordCache;
  };
  api: {
    changeMenu: () => void;
    goToChapter: (position: number, ctrlPos: number) => Promise<boolean>;
    nextChapter: () => Promise<boolean>;
    prevChapter: () => Promise<boolean>;
    saveRecord: (page: number) => void;
  };
}

const ReaderContext = React.createContext({} as ContextValue);

const ContextWrapper: React.FC<any> = ({ children, bookInfo }) => {
  const { api, cache, ...states } = useReader(bookInfo);

  const value = useMemo(() => ({ api, cache, ...states }), [
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

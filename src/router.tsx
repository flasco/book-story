import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { BookProvider } from '@/hooks/use-book';
import { ThemeProvider } from '@/hooks/use-theme';

import ThemeWrapper from './layout/theme-wrapper';

import Read from './pages/read';
import Shelf from './pages/shelf';
import Search from './pages/search';
import Detail from './pages/detail';
import Origin from './pages/origin';
import { connectContext } from './utils';

const basepath = `/`;

const routes = () => (
  <ThemeWrapper>
    <BrowserRouter basename={basepath}>
      <Routes>
        <Route path="/shelf" element={<Shelf />} />
        <Route path="/read" element={<Read />} />
        <Route path="/search" element={<Search />} />
        <Route path="/origin" element={<Origin />} />
        <Route path="/detail" element={<Detail />} />

        <Route path="/*" element={<Navigate to="/shelf" />} />
      </Routes>
    </BrowserRouter>
  </ThemeWrapper>
);

export default connectContext(routes, ThemeProvider, BookProvider);

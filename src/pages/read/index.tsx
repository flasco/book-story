import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@/layout/container';
import { useBook } from '@/hooks/use-book';

import Provider from './context';

import NavBlock from './components/nav-block';
import NewReader from './components/new-reader';

import styles from './index.module.scss';

const Home = () => {
  const { currentBook } = useBook();
  const navigate = useNavigate();
  const bookInfo = currentBook ?? null;

  useEffect(() => {
    if (bookInfo == null || bookInfo.source == null) navigate('/shelf', { replace: true });
  }, [bookInfo]);

  return (
    <Container className={styles.container}>
      <Provider bookInfo={bookInfo}>
        <NavBlock />
        <NewReader />
      </Provider>
    </Container>
  );
};

export default Home;

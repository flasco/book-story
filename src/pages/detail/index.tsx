import React from 'react';

import Container from '@/layout/container';
import ImageShow from '@/components/image-show';
import { IBookX } from '@/defination';

import styles from './index.m.scss';
import { Button } from 'antd-mobile';
import { useHistory } from 'react-router-dom';

const DetailPage = props => {
  const bookInfo: IBookX = props?.location?.state ?? {};
  const { push } = useHistory();

  const { img, bookName, author, desc } = bookInfo;

  const readBook = () => {
    push('/read', bookInfo);
  };

  return (
    <Container showBar title={bookName} back className={styles.contianer}>
      <div className={styles.info}>
        <ImageShow src={img} className={styles.img} />
        <div className={styles.right}>
          <div className={styles.title}>{bookName}</div>
          <div className={styles.sub}>{author}</div>
          <div className={styles.sub}>plantForm</div>
        </div>
      </div>
      <div className={styles.btns}>
        <Button type="ghost" className={styles.btn}>
          追书
        </Button>
        <Button type="primary" className={styles.btn} onClick={readBook}>
          开始阅读
        </Button>
      </div>
      <div className={styles.desc}>
        {desc.split('\n').map((i, ind) => (
          <p key={ind}>{i}</p>
        ))}
      </div>
    </Container>
  );
};

export default DetailPage;

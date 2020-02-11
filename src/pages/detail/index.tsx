import React, { useEffect, useState } from 'react';
import { Button } from 'antd-mobile';
import { useHistory } from 'react-router-dom';

import Container from '@/layout/container';
import ImageShow from '@/components/image-show';
import { IBookX } from '@/defination';
import { useBook } from '@/hooks/use-book';

import { getDetail } from './api';

import styles from './index.m.scss';

const DetailPage = props => {
  const { push } = useHistory();
  const {
    api: { isExistBook, insertBook },
  } = useBook();

  const [bookInfo, setInfo] = useState<IBookX>(props?.location?.state ?? {});
  const { img, bookName, author, desc, source, plantformId } = bookInfo;

  const sourceUrl = source[plantformId];

  useEffect(() => {
    if (img == null) {
      getDetail(sourceUrl).then(val => {
        setInfo({
          ...bookInfo,
          desc: val.desc,
          img: val.image,
        });
      });
    }
  }, []);

  if (desc == null) return null;

  const plantform = new URL(sourceUrl).host;

  const readBook = () => {
    push('/read', bookInfo);
  };

  const addBook = () => {
    insertBook(bookInfo);
  };

  const renderAddBtn = () => {
    const isExist = isExistBook(bookInfo);
    if (!isExist) {
      return (
        <Button type="ghost" className={styles.btn} onClick={addBook}>
          追书
        </Button>
      );
    }
    return (
      <Button className={styles.btn} disabled>
        已存在
      </Button>
    );
  };

  return (
    <Container showBar title={bookName} back className={styles.contianer}>
      <div className={styles.info}>
        <ImageShow src={img} className={styles.img} />
        <div className={styles.right}>
          <div className={styles.title}>{bookName}</div>
          <div className={styles.sub}>{author}</div>
          <div className={styles.sub}>{plantform}</div>
        </div>
      </div>
      <div className={styles.btns}>
        {renderAddBtn()}
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

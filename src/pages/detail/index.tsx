import React, { useEffect, useState } from 'react';
import { Button } from 'antd-mobile';
import { useHistory } from 'react-router-dom';

import Container from '@/layout/container';
import ImageShow from '@/components/image-show';
import { IBookX } from '@/defination';
import { useBook } from '@/hooks/use-book';

import { getDetail } from './api';

import styles from './index.m.scss';
import { openLoading, closeLoading } from '@/utils';

const DetailPage = props => {
  const { push } = useHistory();
  const {
    api: { isExistBook, insertBook },
  } = useBook();

  const [bookInfo, setInfo] = useState<IBookX>(props?.location?.state ?? {});
  const { img, bookName, author, desc = '', source, plantformId } = bookInfo;
  const [loading, setLoading] = useState(desc == null);

  const sourceUrl = source[plantformId];

  useEffect(() => {
    if (img == null) {
      openLoading();
      getDetail(sourceUrl).then(val => {
        setLoading(false);
        closeLoading();
        setInfo({
          ...bookInfo,
          desc: val.desc,
          img: val.image,
        });
      });
    }
  }, []);

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

  const renderContent = () => {
    if (loading) return null;
    return (
      <>
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
      </>
    );
  };

  return (
    <Container showBar title={bookName} back className={styles.contianer}>
      {renderContent()}
    </Container>
  );
};

export default DetailPage;

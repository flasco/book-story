import { useEffect, useState } from 'react';
import { Button } from 'antd-mobile';
import { useHistory } from 'react-router-dom';

import Container from '@/layout/container';
import ImageShow from '@/components/image-show';
import { IBookX } from '@/defination';
import { useBook } from '@/hooks/use-book';
import { openLoading, closeLoading, toastFail } from '@/utils';

import { getDetail } from './api';

import styles from './index.module.scss';

const DetailPage = props => {
  const { push } = useHistory();
  const {
    api: { getExistBook, insertBook, setCurBook },
  } = useBook();

  const initBook = props?.location?.state ?? {};
  const existedBook = getExistBook(initBook);
  const isExist = !!existedBook;

  const [bookInfo, setInfo] = useState<IBookX>(existedBook ?? initBook);
  const { img, bookName, author, desc = '', source } = bookInfo;
  const [plantformId, setPlantformId] = useState(bookInfo.plantformId ?? 0);
  const [loading, setLoading] = useState(desc == null);

  useEffect(() => {
    if (isExist) return;
    openLoading();
    getDetail(source)
      .then(results => {
        setLoading(false);
        closeLoading();
        if (!results.length) throw new Error('error');
        const bestResult = results[0];
        setPlantformId(bestResult.plantformId);
        setInfo({
          ...bookInfo,
          desc: bestResult.desc,
          img: bestResult.image,
          catalogUrl: bestResult.catalogUrl,
        });
      })
      .catch(() => {
        setLoading(false);
        closeLoading();
        toastFail({ text: '网络请求失败，请稍后重试' });
      });
  }, []);

  const readBook = () => {
    push('/read');
    setCurBook(bookInfo);
  };

  const addBook = () => {
    insertBook(bookInfo).catch(() => {
      closeLoading();
      toastFail({ text: '书籍添加失败，请稍后重试' });
    });
  };

  const renderAddBtn = () => {
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
    const plantform = new URL(source[plantformId]).host;

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
        <div className={styles.desc}>
          书源：
          <ul>
            {Object.entries(source).map(([, value]) => (
              <li key={value}>{new URL(value).host}</li>
            ))}
          </ul>
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

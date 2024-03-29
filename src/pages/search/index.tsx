import { useCallback, useState } from 'react';
import { SearchBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import Container from '@/layout/container';
import VirtualList from '@/components/virtual-list';
import { IBookX } from '@/definition';
import { openLoading, closeLoading, toastFail } from '@/utils';
import Touchable from '@/components/touchable';

import { newSearch } from './api';

import styles from './index.module.scss';


const HINT_TIPS = {
  INIT: '输入后点击 done 即可搜索书籍。',
  EMPTY: '无相关搜索结果。',
  RESULT: (cnt: number) => `搜索到${cnt}条相关数据。`,
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<IBookX[]>([]);
  const [hint, setHint] = useState(HINT_TIPS.INIT);

  const searchOpe = useCallback(
    async (keyword: string) => {
      if (keyword.length < 1) {
        toastFail({ text: '请输入关键字', sec: 2000 });
        return;
      }
      openLoading('加载中...');
      try {
        const result = await newSearch(keyword);
        setList(result);
        const len = result?.length ?? 0;
        setHint(len > 0 ? HINT_TIPS.RESULT(len) : HINT_TIPS.EMPTY);
        closeLoading();
      } catch (error) {
        toastFail({ text: '未知错误，请稍后重试...' });
      }
    },
    [setList]
  );

  const cancelSearch = useCallback(() => navigate(-1), [navigate]);

  const renderItem = ({ style, index }) => {
    const item = list[index];
    return (
      <Touchable
        style={style}
        className={styles.item}
        onClick={() =>
          navigate('/detail', {
            state: item,
          })
        }
      >
        <span>{`${item.bookName} - ${item.author}`}</span>
      </Touchable>
    );
  };

  return (
    <Container showBar title="搜索" back>
      <SearchBar
        placeholder="输入关键字"
        onSearch={searchOpe}
        onCancel={cancelSearch}
        className={styles.search}
      />
      <div className={styles.hint}>{hint}</div>
      <VirtualList data={list} itemSize={40} preLength={119} renderItem={renderItem} />
    </Container>
  );
};

export default SearchPage;

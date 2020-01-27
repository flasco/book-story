import React, { useCallback, useState } from 'react';
import { SearchBar, Toast } from 'antd-mobile';

import Container from '@/layout/container';
import VirtualList from '@/components/virtual-list';
import { IBookX } from '@/defination';

import { search } from './api';
import { openLoading, closeLoading } from '@/utils';

import styles from './index.m.scss';
import Touchable from '@/components/touchable';
import { useHistory } from 'react-router-dom';

const HINT_TIPS = {
  INIT: '输入后点击 done 即可搜索书籍。',
  EMPTY: '无相关搜索结果。',
  RESULT: (cnt: number) => `搜索到${cnt}条相关数据。`,
};

const SearchPage = () => {
  const [list, setList] = useState<IBookX[]>([]);
  const [hint, setHint] = useState(HINT_TIPS.INIT);
  const { push, go } = useHistory();
  const searchOpe = useCallback(
    async (keyword: string) => {
      if (keyword.length < 1) {
        Toast.fail('请输入关键字');
        return;
      }
      openLoading('加载中...');
      const result = await search(keyword);
      setList(result);
      const len = result?.length ?? 0;
      setHint(len > 0 ? HINT_TIPS.RESULT(len) : HINT_TIPS.EMPTY);

      closeLoading();
    },
    [setList]
  );

  const cancelSearch = useCallback(() => go(-1), [go]);

  const renderItem = ({ style, index }) => {
    const item = list[index];
    return (
      <Touchable style={style} className={styles.item} onClick={() => push('/detail', item)}>
        <span>{`${item.bookName} - ${item.author}`}</span>
      </Touchable>
    );
  };

  return (
    <Container showBar title="搜索" back>
      <SearchBar placeholder="输入关键字" onSubmit={searchOpe} onCancel={cancelSearch} />
      <div className={styles.hint}>{hint}</div>
      <VirtualList data={list} itemSize={40} preLength={119} renderItem={renderItem} />
    </Container>
  );
};

export default SearchPage;
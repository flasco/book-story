import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { SearchBar, Toast, Icon } from 'antd-mobile';

import Container from '@/layout/container';
import VirtualList from '@/components/virtual-list';
import { IBookX } from '@/defination';

import { newSearch } from './api';
import { openLoading, closeLoading } from '@/utils';

import styles from './index.m.scss';
import Touchable from '@/components/touchable';
import { useHistory } from 'react-router-dom';
import { getSearchSetting } from '@/storage/search-setting';

const HINT_TIPS = {
  INIT: '输入后点击 done 即可搜索书籍。',
  EMPTY: '无相关搜索结果。',
  RESULT: (cnt: number) => `搜索到${cnt}条相关数据。`,
};

const RightIcon = ({ onClick }) => (
  <div onClick={onClick}>
    <Icon type="ellipsis" size="md" color="#fff" />
  </div>
);

const SearchPage = () => {
  const { push, go } = useHistory();
  const [list, setList] = useState<IBookX[]>([]);
  const [hint, setHint] = useState(HINT_TIPS.INIT);
  const [sites, setSites] = useState([] as string[]);

  useEffect(() => {
    getSearchSetting().then(val => setSites(val));
  }, []);

  const searchOpe = useCallback(
    async (keyword: string) => {
      if (keyword.length < 1) {
        Toast.fail('请输入关键字');
        return;
      }
      openLoading('加载中...');
      try {
        const result = await newSearch(keyword, sites);
        setList(result);
        const len = result?.length ?? 0;
        setHint(len > 0 ? HINT_TIPS.RESULT(len) : HINT_TIPS.EMPTY);
        closeLoading();
      } catch (error) {
        Toast.show('未知错误，请稍后重试...', 2);
      }
    },
    [setList, sites]
  );

  const right = useMemo(() => <RightIcon onClick={() => push('/search-setting')} />, [push]);

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
    <Container showBar title="搜索" back topRight={right}>
      <SearchBar
        placeholder="输入关键字"
        onSubmit={searchOpe}
        onCancel={cancelSearch}
        className={styles.search}
      />
      <div className={styles.hint}>{hint}</div>
      <VirtualList data={list} itemSize={40} preLength={119} renderItem={renderItem} />
    </Container>
  );
};

export default SearchPage;

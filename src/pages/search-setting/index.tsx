import React, { useState, useEffect } from 'react';
import { Checkbox, List, Button } from 'antd-mobile';

import { getSearchSetting, setSearchSetting } from '@/storage/search-setting';

import Container from '@/layout/container';

import { getSites } from './api';

import styles from './index.m.scss';

const CheckboxItem = Checkbox.CheckboxItem;

const SearchPage = () => {
  const [data, setData] = useState([] as any[]);
  const [checkMap, setCheckMap] = useState({});

  useEffect(() => {
    getSites().then(val => setData(val));
    getSearchSetting().then(searched => {
      searched.forEach(key => {
        checkMap[key] = true;
      });
      setCheckMap({ ...checkMap });
    });
  }, []);

  const onCheck = (key, checked) => {
    checkMap[key] = checked;
    setCheckMap({ ...checkMap });
  };

  const onYes = () => {
    const checked = Object.keys(checkMap).filter(key => !!checkMap[key]);
    setSearchSetting(checked);
    alert('保存成功');
  };

  return (
    <Container showBar title="搜索设置" back>
      <List>
        {data.map(i => (
          <CheckboxItem key={i} checked={checkMap[i]} onChange={e => onCheck(i, e.target.checked)}>
            {i}
          </CheckboxItem>
        ))}
      </List>
      <Button className={styles.btn} onClick={onYes}>
        确定
      </Button>
    </Container>
  );
};

export default SearchPage;

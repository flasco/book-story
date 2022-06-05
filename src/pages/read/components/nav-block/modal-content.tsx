import { Button } from 'antd-mobile';
import React, { useState } from 'react';

import styles from './index.module.scss';

const ModalContent = ({ initialStr, onConfirm, onCancel }: any) => {
  const [filterStr, setFilterStr] = useState(initialStr);

  return (
    <div>
      <textarea
        className={styles['filter-textarea']}
        style={{ paddingTop: 8 }}
        value={filterStr}
        placeholder="请输入需要过滤规则，换行可以书写多条规则"
        onChange={val => {
          console.log(val.target.value);
          setFilterStr(val.target.value);
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button style={{ padding: '6px 26px' }} onClick={onCancel}>
          取消
        </Button>
        <Button
          style={{ marginLeft: 12, padding: '6px 26px' }}
          color="primary"
          onClick={() => onConfirm(filterStr)}
        >
          确认
        </Button>
      </div>
    </div>
  );
};

export default ModalContent;

import { Button, TextArea } from 'antd-mobile';
import React, { useState } from 'react';

const ModalContent = ({ initialStr, onConfirm, onCancel }: any) => {
  const [filterStr, setFilterStr] = useState(initialStr);

  return (
    <div>
      <TextArea
        style={{ paddingTop: 8 }}
        rows={5}
        value={filterStr}
        placeholder="请输入需要过滤规则，换行可以书写多条规则"
        onChange={val => {
          console.log(val);
          setFilterStr(val);
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

import React from 'react';
import { Button, Toast } from 'antd-mobile';
import { getS } from '@/utils';

import styles from './index.m.scss';

class Home extends React.PureComponent {
  clickOpen = () => {
    Toast.info('123');
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        <span className={styles.a}>hello.{getS()}</span>
        <br/>
        <Button onClick={this.clickOpen}>test</Button>
      </div>
    );
  }
}

export default Home;

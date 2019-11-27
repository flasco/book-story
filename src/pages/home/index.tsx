import React from 'react';
import { Button, Notify } from 'zent';
import { getS } from '@/utils';
import './index.scss';

class Home extends React.PureComponent {
  clickOpen = () => {
    Notify.error('123');
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        <span>hello.{getS()}</span>
        <br/>
        <Button onClick={this.clickOpen}>test</Button>
      </div>
    );
  }
}

export default Home;

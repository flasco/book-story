import React from 'react';

import Content, { IContentProps } from './content';
import Title from './title';

import styles from './index.m.scss';

interface INewReaderProps extends IContentProps {
  title?: string;
}

const NewReader: React.FC<INewReaderProps> = props => {
  const { pages, title = '', initPage } = props;
  return (
    <div className={styles.container}>
      <Title name={title} />
      <Content pages={pages} initPage={initPage} />
    </div>
  );
};

export default NewReader;

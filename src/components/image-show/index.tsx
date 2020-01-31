import React, { useEffect } from 'react';

import defaultImage from '@/assets/noImg.jpg';

import { getImage } from './api';

// 考虑做个图片本地缓存
const ImageShow: React.FC<any> = ({ src, ...otherProps }) => {
  const ref = React.createRef<HTMLImageElement>();

  useEffect(() => {
    getImage(src)
      .then(image => {
        (ref.current as any).src = image;
      })
      .catch(() => {
        (ref.current as any).src = defaultImage;
      })
      .catch(() => null);
  }, []);

  return <img {...otherProps} ref={ref} />;
};

export default ImageShow;

import React, { useState, useLayoutEffect } from 'react';

import defaultImage from '@/assets/noImg.jpg';

import { getImage } from './api';

// 考虑做个图片本地缓存
const ImageShow: React.FC<any> = ({ src, ...otherProps }) => {
  const [origin, setSrc] = useState(null);

  useLayoutEffect(() => {
    getImage(src)
      .then(image => {
        setSrc(image);
      })
      .catch(() => {
        setSrc(defaultImage);
      });
  }, [src]);

  return React.createElement('img', { ...otherProps, src: origin });
};

export default ImageShow;

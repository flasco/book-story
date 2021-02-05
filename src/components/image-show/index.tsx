import React, { useState, useLayoutEffect, useRef } from 'react';

import defaultImage from '@/assets/noImg.jpg';

import { getImage } from './api';

// 考虑做个图片本地缓存
const ImageShow: React.FC<any> = ({ src, ...otherProps }) => {
  const [origin, setSrc] = useState(null);
  const isActive = useRef(true);

  useLayoutEffect(() => {
    getImage(src)
      .then(image => {
        if (isActive.current) {
          setSrc(image);
        }
      })
      .catch(() => {
        setSrc(defaultImage);
      });
    return () => {
      isActive.current = false;
    };
  }, [src]);

  return React.createElement('img', { ...otherProps, src: origin });
};

export default ImageShow;

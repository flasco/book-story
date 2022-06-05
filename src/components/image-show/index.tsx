import React, { useState, useLayoutEffect, useRef } from 'react';

import { getImage } from './api';

// 考虑做个图片本地缓存
const ImageShow: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { src: string }> = ({
  src,
  ...otherProps
}) => {
  const [origin, setSrc] = useState<string>(undefined as any);
  const isActive = useRef(true);

  useLayoutEffect(() => {
    getImage(src)
      .then(image => {
        if (isActive.current) {
          setSrc(image);
        }
      })
      .catch(() => {
        setSrc('https://unpkg.com/@leavo/book-story@0.0.6/dist/assets/noImg.jpg');
      });
    return () => {
      isActive.current = false;
    };
  }, [src]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <img {...otherProps} alt="cover" src={origin} />;
};

export default ImageShow;

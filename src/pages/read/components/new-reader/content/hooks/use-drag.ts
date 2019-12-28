import { createRef, useState, useCallback } from 'react';
import cx from 'classnames';

import { screenWidth, leftBoundary, rightBoundary } from '@/constants';

import styles from './index.m.scss';

let startX = 0;

const pageWidth = screenWidth - 16;
let inAnimate = false;

interface IUseDragParams {
  initPage: number;
  total: number;
  baseClass: string;
}

function useDrag({ initPage, total, baseClass }: IUseDragParams) {
  const ref = createRef<HTMLDivElement>();
  const [page, setPage] = useState(initPage - 1);

  const onTouchStart = useCallback(
    e => {
      if (inAnimate) return;
      startX = e.touches[0].clientX;

      const current = ref.current as HTMLDivElement;
      requestAnimationFrame(() => {
        // 跟随手指移动的样式
        current.className = cx(baseClass, styles.drag);
      });
    },
    [ref]
  );

  const onTouchMove = useCallback(
    (e: any) => {
      e.preventDefault();
      if (inAnimate) return;
      const prevX = e.touches[0].clientX - startX;

      const current = ref.current as HTMLDivElement;
      requestAnimationFrame(() => {
        current.style.webkitTransform = `translate3d(-${page * pageWidth - prevX}px, 0, 0)`;
      });
    },
    [page, ref]
  );

  const onTouchEnd = useCallback(
    e => {
      if (inAnimate) return;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      let currentPage = page;
      if (Math.abs(diff) > 20) {
        currentPage += diff < 0 ? 1 : -1;
      } else {
        if (endX < leftBoundary) {
          currentPage -= 1;
        } else if (endX > rightBoundary) {
          currentPage += 1;
        } else {
          console.log('open menu');
        }
      }

      if (currentPage < 0 || currentPage >= total) currentPage = page;

      page !== currentPage && setPage(currentPage);

      const current = ref.current as HTMLDivElement;
      inAnimate = true;
      requestAnimationFrame(() => {
        current.className = cx(baseClass, styles.move);
        current.style.webkitTransform = `translate3d(-${currentPage * pageWidth}px, 0, 0)`;
        setTimeout(() => (inAnimate = false), 160);
      });
    },
    [ref, page, total]
  );

  return {
    page,
    ref,
    touchEvent: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}

export default useDrag;

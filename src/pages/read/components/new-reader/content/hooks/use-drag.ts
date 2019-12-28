import { createRef, useState, useCallback } from 'react';
import throttle from 'lodash/throttle';

import { screenWidth, leftBoundary, rightBoundary } from '@/constants';

let startX = 0;

const pageWidth = screenWidth - 16;

interface IUseDragParams {
  initPage: number;
  total: number;
}

function useDrag({ initPage, total }: IUseDragParams) {
  const ref = createRef<HTMLDivElement>();
  const [inAnimate, setAnimate] = useState(false);
  const [page, setPage] = useState(initPage - 1);

  const onTouchStart = useCallback(
    e => {
      if (inAnimate) return;
      startX = e.touches[0].clientX;

      const current = ref.current as HTMLDivElement;
      requestAnimationFrame(() => {
        // 跟随手指移动的样式
        current.style.transition = 'transform 50ms ease 0s';
      });
    },
    [ref, inAnimate]
  );

  const onTouchMove = useCallback(
    throttle((e: any) => {
      if (inAnimate) return;
      const prevX = e.touches[0].clientX - startX;

      const current = ref.current as HTMLDivElement;
      current != null &&
        requestAnimationFrame(() => {
          current.style.transform = `translateX(-${page * pageWidth - prevX}px)`;
        });
    }, 18),
    [page, ref, inAnimate]
  );

  const onMove = useCallback(
    e => {
      e.persist();
      onTouchMove(e);
    },
    [onTouchMove]
  );

  const onTouchEnd = useCallback(
    e => {
      if (inAnimate) return;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      let currentPage = page;
      let isAnimate = false;
      if (Math.abs(diff) > 20) {
        isAnimate = true;
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
      setAnimate(true);
      requestAnimationFrame(() => {
        current.style.transition = `transform ${isAnimate ? '150' : '120'}ms ease 0s`;
        current.style.transform = `translateX(-${currentPage * pageWidth}px)`;
        setTimeout(() => setAnimate(false), 160);
      });
    },
    [ref, page, total, inAnimate]
  );

  return {
    page,
    ref,
    touchEvent: {
      onTouchStart,
      onTouchMove: onMove,
      onTouchEnd,
    },
  };
}

export default useDrag;

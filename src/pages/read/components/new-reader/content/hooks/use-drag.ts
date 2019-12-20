import { createRef, useState, useCallback } from 'react';

import { screenWidth, leftBoundary, rightBoundary } from '@/constants';

let startX = 0;

const pageWidth = screenWidth - 16;

interface IUseDragParams {
  initPage: number;
  total: number;
}

function useDrag({ initPage, total }: IUseDragParams) {
  const ref = createRef<HTMLDivElement>();
  const [page, setPage] = useState(initPage - 1);

  const onTouchStart = useCallback(
    e => {
      startX = e.touches[0].clientX;

      const current = ref.current as HTMLDivElement;
      requestAnimationFrame(() => {
        current.style.transition = 'transform 50ms ease 0s';
      });
    },
    [ref]
  );

  const onTouchMove = useCallback(
    e => {
      const prevX = e.touches[0].clientX - startX;

      const current = ref.current as HTMLDivElement;
      requestAnimationFrame(() => {
        current.style.transform = `translateX(-${page * pageWidth - prevX}px)`;
      });
    },
    [page, ref]
  );

  const onTouchEnd = useCallback(
    e => {
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

      if (currentPage < 0 || currentPage >= total) return;

      page !== currentPage && setPage(currentPage);

      const current = ref.current as HTMLDivElement;
      requestAnimationFrame(() => {
        current.style.transition = `transform ${isAnimate ? '150' : '0'}ms ease 0s`;
        current.style.transform = `translateX(-${currentPage * pageWidth}px)`;
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

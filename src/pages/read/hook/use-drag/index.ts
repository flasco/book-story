import { createRef, useState, useCallback, useEffect } from 'react';

import { screenWidth, leftBoundary, rightBoundary } from '@/constants';
import { Toast } from 'antd-mobile';

let startX = 0;
let inAnimate = false;
let ctrlPos = 0;

const pageWidth = screenWidth - 16;

interface IUseDragParams {
  initPage: number;
  prevChapter: () => Promise<boolean>;
  nextChapter: () => Promise<boolean>;
}

function useDrag(pages, { initPage, prevChapter, nextChapter }: IUseDragParams) {
  const ref = createRef<HTMLDivElement>();
  const [page, setPage] = useState(initPage - 1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (pages.length > 0) {
      const totalWidth = ref.current?.scrollWidth as number;
      const totalPage = (totalWidth + 16) / pageWidth;
      setTotal(totalPage);
      if (ctrlPos < 0) goTo(totalPage, false);
      else if (ctrlPos > 0) goTo(1, false);
    }
  }, [pages]);

  useEffect(() => {
    if (initPage > 1) goTo(initPage, false);
  }, [initPage]);

  /** cur 从1开始 */
  const goTo = useCallback(
    (cur: number, needAnimate = true) => {
      cur = cur - 1;
      const current = ref.current as HTMLDivElement;
      setPage(cur);
      inAnimate = true;
      requestAnimationFrame(() => {
        current.style.transition = needAnimate ? 'transform 150ms ease 0s' : 'none';
        current.style.transform = `translateX(${0 - cur * pageWidth}px)`;
        setTimeout(() => (inAnimate = false), needAnimate ? 160 : 30);
      });
      ctrlPos = 0;
    },
    [ref]
  );

  const onTouchStart = useCallback(
    e => {
      if (inAnimate) return;
      startX = e.touches[0].clientX;

      const current = ref.current as HTMLDivElement;
      requestAnimationFrame(() => {
        // 跟随手指移动的样式
        current.style.transition = 'none';
      });
    },
    [ref]
  );

  /** 垃圾throttle，别用，用了就掉帧 */
  const onTouchMove = useCallback(
    (e: any) => {
      e.preventDefault();
      if (inAnimate) return;
      const prevX = e.touches[0].clientX - startX;

      const current = ref.current as HTMLDivElement;
      requestAnimationFrame(() => {
        current.style.transform = `translateX(${0 - page * pageWidth + prevX}px)`;
      });
    },
    [page, ref]
  );

  const onTouchEnd = useCallback(
    async e => {
      if (inAnimate) return;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      let currentPage = page;
      let needAnimate = false;
      if (Math.abs(diff) > 5) {
        needAnimate = true;
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

      if (currentPage < 0) {
        ctrlPos = -1;
        const isEdge = !(await prevChapter());
        if (isEdge) {
          Toast.info('已经是第一章');
          currentPage = page;
        }
        return;
      } else if (currentPage >= total) {
        ctrlPos = 1;
        const isEdge = !(await nextChapter());
        if (isEdge) {
          Toast.info('已经是到底了');
          currentPage = page;
        }
        return;
      }
      page !== currentPage && setPage(currentPage);
      goTo(currentPage + 1, needAnimate);
    },
    [ref, page, total]
  );

  return {
    page,
    total,
    ref,
    goTo,
    touchEvent: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}

export default useDrag;

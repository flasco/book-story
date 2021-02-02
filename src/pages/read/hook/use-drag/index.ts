import { createRef, useState, useCallback, useEffect } from 'react';

import { screenWidth, leftBoundary, rightBoundary } from '@/constants';
import { Toast } from 'antd-mobile';
import { changeCtrlPos, getCtrlPos } from '../use-reader';

let startX = 0;
let inAnimate = false;

const pageWidth = screenWidth - 16;

function useDrag(pages, { saveRecord, initialPage, hookCenter, hookLeft, hookRight }) {
  const ref = createRef<HTMLDivElement>();
  const [page, setPage] = useState(() => Math.round(initialPage - 1));
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const totalWidth = ref.current!.scrollWidth;
    const totalPage = (totalWidth + 16) / pageWidth;
    setTotal(totalPage);
    const ctrlPos = getCtrlPos();
    if (ctrlPos < 0) goTo(totalPage, false);
    else if (ctrlPos > 0) goTo(1, false);
    setTimeout(() => setLoading(false), 100);
  }, [pages]);

  useEffect(() => {
    if (initialPage > 1) goTo(Math.round(initialPage), false);
  }, [initialPage]);

  /** cur 从1开始 */
  const goTo = useCallback(
    (cur: number, needAnimate = true) => {
      cur = Math.round(cur - 1);
      const current = ref.current;
      setPage(cur);
      saveRecord(cur);
      inAnimate = true;
      requestAnimationFrame(() => {
        current!.style.transition = needAnimate ? 'transform 150ms ease 0s' : 'none';
        current!.style.transform = `translateX(${0 - cur * pageWidth}px)`;
        setTimeout(() => (inAnimate = false), needAnimate ? 160 : 30);
      });
      changeCtrlPos(0);
    },
    [ref]
  );

  const onTouchStart = useCallback(
    e => {
      if (inAnimate) return;
      startX = e.touches[0].clientX;

      const current = ref.current;
      requestAnimationFrame(() => {
        // 跟随手指移动的样式
        current!.style.transition = 'none';
      });
    },
    [ref]
  );

  /** 垃圾throttle，别用，用了就掉帧 */
  const onTouchMove = useCallback(
    (e: any) => {
      if (inAnimate) return;
      const prevX = e.touches[0].clientX - startX;

      const current = ref.current;
      requestAnimationFrame(() => {
        current!.style.transform = `translateX(${0 - page * pageWidth + prevX}px)`;
      });
    },
    [page, ref]
  );

  const onTouchEnd = useCallback(
    async e => {
      e.preventDefault();
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
          await hookCenter?.();
          return;
        }
      }

      const isLeftEdge = currentPage < 0;
      const isInEdge = isLeftEdge || currentPage >= total;
      if (isInEdge) {
        const curApi = isLeftEdge ? hookLeft : hookRight;
        setLoading(true);
        const isSucceed = (await curApi?.()) ?? false;
        if (!isSucceed) {
          setLoading(false);
          Toast.info('已经临近边界', 2, undefined, false);
          currentPage = page;
        }
        return;
      }

      page !== currentPage && setPage(Math.round(currentPage));
      goTo(currentPage + 1, needAnimate);
    },
    [ref, page, total]
  );

  return {
    page,
    total,
    ref,
    goTo,
    loading,
    touchEvent: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}

export default useDrag;

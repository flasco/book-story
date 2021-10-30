import { createRef, useState, useCallback, useEffect } from 'preact/compat';
import { useSpring } from '@react-spring/web';
import { Toast } from 'antd-mobile-v5';

import { screenWidth, leftBoundary, rightBoundary } from '@/constants';

import { changeCtrlPos, getCtrlPos } from '../use-reader';

let startX = 0;
let inAnimate = false;

const pageWidth = screenWidth - 16;

function useCustomDrag(pages, { saveRecord, initialPage, hookCenter, hookLeft, hookRight }) {
  const ref = createRef<HTMLDivElement>();
  const [page, setPage] = useState(() => Math.round(initialPage - 1));
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [{ transformX }, api] = useSpring(() => ({
    from: { transformX: 0 },
    config: { duration: 150 },
  }));

  useEffect(() => {
    const totalWidth = ref.current!.scrollWidth;
    const totalPage = (totalWidth + 16) / pageWidth;
    setTotal(totalPage);
    const ctrlPos = getCtrlPos();
    if (ctrlPos < 0) {
      goTo(totalPage, false);
    } else if (ctrlPos > 0) {
      goTo(1, false);
    }
    setTimeout(() => setLoading(false), 100);
  }, [pages]);

  useEffect(() => {
    if (initialPage > 1) {
      goTo(Math.round(initialPage), false);
    }
  }, [initialPage]);

  /** cur 从1开始 */
  const goTo = useCallback(
    (cur: number, needAnimate = true) => {
      cur = Math.round(cur - 1);
      setPage(cur);
      saveRecord(cur);
      inAnimate = true;
      requestAnimationFrame(async () => {
        const params = { transformX: 0 - cur * pageWidth };
        if (needAnimate) {
          await Promise.all(api.start(params));
        } else {
          api.set(params);
        }

        inAnimate = false;
      });
      changeCtrlPos(0);
    },
    [ref]
  );

  const onTouchStart = useCallback(
    e => {
      if (inAnimate) {
        return;
      }
      startX = e.touches[0].clientX;
    },
    [ref]
  );

  /** 垃圾throttle，别用，用了就掉帧 */
  const onTouchMove = useCallback(
    (e: any) => {
      if (inAnimate) {
        return;
      }
      const prevX = e.touches[0].clientX - startX;

      api.set({ transformX: 0 - page * pageWidth + prevX });
    },
    [page, ref]
  );

  const onTouchEnd = useCallback(
    async e => {
      e.preventDefault();
      if (inAnimate) {
        return;
      }
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
          Toast.show('已经临近边界');
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
    transformX,
    touchEvent: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}

export default useCustomDrag;

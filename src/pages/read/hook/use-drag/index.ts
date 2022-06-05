import { createRef, useState, useCallback, useEffect, useRef } from 'react';
import { useSpring } from '@react-spring/web';
import { Toast } from 'antd-mobile';
import { fromEvent } from 'rxjs';
import { concatMap, filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { screenWidth, leftBoundary, rightBoundary } from '@/constants';

import { useCallbackRef } from '@/hooks';

import { changeCtrlPos, getCtrlPos } from '../use-reader';

const pageWidth = screenWidth - 16;

function useCustomDrag(pages, { saveRecord, initialPage, hookCenter, hookLeft, hookRight }) {
  const innerRef = createRef<HTMLDivElement>();
  const outerRef = createRef<HTMLDivElement>();
  const [page, setPage] = useState(() => Math.round(initialPage - 1));
  const inAnimate = useRef(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [{ transformX }, api] = useSpring(() => ({
    from: { transformX: 0 },
    config: { duration: 150 },
  }));

  /** cur 从1开始 */
  const goTo = useCallback(
    (cur: number, needAnimate = true) => {
      cur = Math.round(cur - 1);
      setPage(cur);
      saveRecord(cur);
      inAnimate.current = true;
      requestAnimationFrame(async () => {
        const params = { transformX: 0 - cur * pageWidth };
        if (needAnimate) {
          await Promise.all(api.start(params));
        } else {
          api.set(params);
        }

        inAnimate.current = false;
      });
      changeCtrlPos(0);
    },
    [api, inAnimate]
  );

  useEffect(() => {
    const totalWidth = innerRef.current!.scrollWidth;
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

  const touchEndFn = useCallbackRef(
    async ({ diff, endX }) => {
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
        if (isSucceed) return;
        setLoading(false);
        Toast.show('已经临近边界');
        currentPage = page;
      }

      page !== currentPage && setPage(Math.round(currentPage));
      goTo(currentPage + 1, needAnimate);
    },
    [page, total]
  );

  useEffect(() => {
    // 事件绑定到 outer 上是为了避免在内容不全的时候无法翻页，确保交互可以正常执行
    const current = outerRef.current!;
    const touchStart = fromEvent<TouchEvent>(current, 'touchstart').pipe(
      map(e => e.touches[0].clientX)
    );
    const touchMove = fromEvent<TouchEvent>(current, 'touchmove');
    const touchEnd = fromEvent<TouchEvent>(current, 'touchend');

    const mover = touchStart.pipe(
      filter(() => !inAnimate.current),
      concatMap(() => touchMove.pipe(takeUntil(touchEnd))),
      withLatestFrom(touchStart, (move, startX) => {
        return move.touches[0].clientX - startX;
      })
    );

    const mover$ = mover.subscribe(prevX => {
      api.set({ transformX: 0 - page * pageWidth + prevX });
    });

    const clicker = touchStart.pipe(
      filter(() => !inAnimate.current),
      concatMap(() => touchEnd),
      withLatestFrom(touchStart, (end, startX) => {
        const endX = end.changedTouches[0].clientX;
        return { diff: endX - startX, endX };
      })
    );

    const clicker$ = clicker.subscribe(touchEndFn.current);

    return () => {
      clicker$.unsubscribe();
      mover$.unsubscribe();
    };
  }, [outerRef, api, touchEndFn]);

  return {
    page,
    total,
    innerRef,
    outerRef,
    goTo,
    loading,
    transformX,
  };
}

export default useCustomDrag;

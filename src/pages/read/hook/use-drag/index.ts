import { useState, useCallback, useEffect } from 'react';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { concatMap, filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { screenWidth, leftBoundary, rightBoundary } from '@/constants';
import { Toast } from 'antd-mobile';
import { changeCtrlPos, getCtrlPos } from '../use-reader';
import { useFuncRefCallback } from '@/hooks';

const inAnimate = new BehaviorSubject(false);

const pageWidth = screenWidth - 16;

function useDrag(pages, ref, { saveRecord, initialPage, hookCenter, hookLeft, hookRight }) {
  const [page, setPage] = useState(() => Math.round(initialPage - 1));
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialPage > 1) goTo(Math.round(initialPage), false);
  }, [initialPage]);

  useEffect(() => {
    const totalWidth = ref.current!.scrollWidth;
    const totalPage = (totalWidth + 16) / pageWidth;
    setTotal(totalPage);
    const ctrlPos = getCtrlPos();
    if (ctrlPos < 0) goTo(totalPage, false);
    else if (ctrlPos > 0) goTo(1, false);
    setTimeout(() => setLoading(false), 100);
  }, [pages]);

  /** cur 从1开始 */
  const goTo = useCallback(
    (cur: number, needAnimate = true) => {
      cur = Math.round(cur - 1);
      const current = ref.current;
      setPage(cur);
      saveRecord(cur);
      inAnimate.next(true);
      requestAnimationFrame(() => {
        current!.style.transition = needAnimate ? 'transform 150ms ease 0s' : 'none';
        current!.style.transform = `translateX(${0 - cur * pageWidth}px)`;
        setTimeout(() => inAnimate.next(false), needAnimate ? 160 : 30);
      });
      changeCtrlPos(0);
    },
    [ref]
  );

  const onMoverSubscribe = useFuncRefCallback(
    prevX => {
      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transform = `translateX(${0 - page * pageWidth + prevX}px)`;
        }
      });
    },
    [page]
  );

  const clickerSubscribe = useFuncRefCallback(
    async ({ diff, endX } = {}) => {
      if (diff == null) return;
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
        const isSucceed = (await curApi?.()?.catch(() => false)) ?? false;
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
    [goTo, setLoading, page, total]
  );

  useEffect(() => {
    const current = ref.current!;
    const touchStart = fromEvent<any>(current, 'touchstart').pipe(
      withLatestFrom(inAnimate, (e, isAnimate) => ({ e, isAnimate })),
      filter(({ e, isAnimate }) => !isAnimate || !e),
      map(({ e }) => e.touches[0].clientX)
    );
    const touchMove = fromEvent<any>(current, 'touchmove').pipe(
      withLatestFrom(inAnimate, (e, isAnimate) => ({ e, isAnimate })),
      filter(({ e, isAnimate }) => !isAnimate || !e),
      map(({ e }) => e)
    );
    const touchEnd = fromEvent<any>(current, 'touchend').pipe(
      withLatestFrom(inAnimate, (e, isAnimate) => ({ e, isAnimate })),
      filter(({ e, isAnimate }) => !isAnimate || !e),
      map(({ e }) => e)
    );

    const mover = touchStart.pipe(
      map(() => {
        requestAnimationFrame(() => {
          // 跟随手指移动的样式
          current.style.transition = 'none';
        });
      }),
      concatMap(() => touchMove.pipe(takeUntil(touchEnd))),
      withLatestFrom(touchStart, (move, startX) => {
        return move.touches[0].clientX - startX;
      })
    );

    const mover$ = mover.subscribe(e => onMoverSubscribe.current(e));

    const clicker = touchStart.pipe(
      concatMap(() => touchEnd),
      withLatestFrom(touchStart, (end, startX) => {
        const endX = end.changedTouches[0].clientX;
        return { diff: endX - startX, endX };
      })
    );

    const clicker$ = clicker.subscribe(e => clickerSubscribe.current(e));

    return () => {
      clicker$.unsubscribe();
      mover$.unsubscribe();
    };
  }, [ref, clickerSubscribe, onMoverSubscribe]);

  return {
    page,
    total,
    goTo,
    loading,
  };
}

export default useDrag;

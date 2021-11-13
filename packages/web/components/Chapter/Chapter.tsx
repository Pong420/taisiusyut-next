import React, { useEffect, useCallback, useRef, useState } from 'react';
import router from 'next/router';
import { fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise } from 'rxjs/operators';
import { Button } from '@blueprintjs/core';
import { IChapter, IChapterContent, IGetChapterContent } from '@/typings';
import { Meta } from '@/components/Meta';
import { openPreferences } from '@/components/PreferencesOverlay';
import { useChapterListDrawer } from '@/components/ChapterListDrawer';
import { Preferences, usePreferences } from '@/hooks/usePreferences';
import { useGoBack } from '@/hooks/useGoBack';
import { lastVisitStorage } from '@/utils/storage';
import { ChapterHeader } from './ChapterHeader';
import { ChapterContent } from './ChapterContent';
import classes from './Chapter.module.scss';

export type ChapterParams = {
  bookName: string;
  provider: string;
  chapterNo: number;
};

export interface ChapterData extends ChapterParams {
  chapter: IChapterContent | null;
  chapters: IChapter[];
}

export interface ChapterProps extends Omit<ChapterData, 'bookID'> {
  openPreferences: () => void;
  preferences: Preferences;
}

type ScrollDirection = 'up' | 'down' | 'unknown';

async function gotoChapter({ provider, bookName, chapterNo }: IGetChapterContent, shallow = false) {
  await router.replace(`/book/${provider}/${bookName}/${chapterNo}`, undefined, {
    shallow
  });
}

const getTarget = (chapterNo: number) => document.querySelector<HTMLDivElement>(`#chapter-${chapterNo}`);

const getMarginY = (el: Element) => {
  const style = window.getComputedStyle(el);
  return parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
};

function ChapterComponment({
  bookName,
  provider,
  chapter: initialChapter,
  chapters: initialChapters,
  chapterNo: initialChapterNo,
  preferences,
  openPreferences
}: ChapterProps) {
  const [chapterNums, setChapterNums] = useState([initialChapterNo]);
  const [currentChapter, setCurrentChapter] = useState(initialChapterNo);

  const [openChapterListDrawer, chapters] = useChapterListDrawer({ provider, bookName }, initialChapters);
  const [data, setData] = useState<Record<number, IChapterContent>>(
    initialChapter ? { [initialChapterNo]: initialChapter } : {}
  );

  const scrollerRef = useRef<HTMLDivElement>(null);
  const hasNext = useRef(initialChapter ? !!initialChapter.nextChapter : false);
  const loaded = useRef<Record<string, boolean>>({
    [initialChapterNo]: !!initialChapter
  });
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('unknown');

  const [, setShowOverlay] = useState(false);
  const { fontSize, lineHeight, autoFetchNextChapter } = preferences;
  const { setRecords } = useGoBack();

  const _openChapterListDrawer = () =>
    openChapterListDrawer({
      chapterNo: currentChapter,
      onItemClick: chapter => gotoChapter({ provider, bookName, chapterNo: chapter.no || 1 })
    });

  // const navigateChapter = (factor: 1 | -1) => {
  //   const chapterNo = currentChapter + factor;
  //   const idx = currentChapter + factor - 1;

  //   if (chapterNo <= 0) return alert(`沒有上一章節`);
  //   if (factor === 1) {
  //     // true if not sure has next chapter?
  //     if (!loaded.current[currentChapter]) {
  //       return alert(`請刷新頁面或者稍後再試`);
  //     } else if (!hasNext.current) {
  //       return alert(`沒有下一章節`);
  //     }
  //   }
  //   return gotoChapter({ provider, bookName, chapterNo });
  // };

  const handleChapterLoaded = useCallback(({ chapterNo, chapter }: { chapterNo: number; chapter: IChapterContent }) => {
    hasNext.current = !!chapter.nextChapter;
    loaded.current[chapterNo] = true;

    setData(data => ({ ...data, [chapterNo]: chapter }));

    // for less content or large screen, the content may not scrollable
    // so dispatch scroll event to trigger checking after content loaded
    if (window.scrollY) {
      window.dispatchEvent(new Event('scroll'));
    } else {
      scrollerRef.current?.dispatchEvent(new Event('scroll'));
    }
  }, []);

  // useLastVisitChapter(bookID, currentChapter);

  useEffect(() => {
    const scroller = scrollerRef.current;
    let chapterNo = initialChapterNo;

    if (!scroller) {
      return;
    }

    const isWindowScrollable = () => scroller.scrollHeight === scroller.offsetHeight;

    const scrollTo = (x: number, y: number) => {
      if (isWindowScrollable()) {
        window.scrollTo(x, y);
      } else {
        scroller.scrollLeft = x;
        scroller.scrollTop = y;
      }
    };

    const scrollToTarget = () => {
      const offsetTop = getTarget(initialChapterNo)?.offsetTop;
      if (typeof offsetTop === 'number') {
        scrollTo(0, offsetTop - scroller.offsetTop);
      }
    };

    setCurrentChapter(initialChapterNo);

    setChapterNums(chapterNums => {
      if (chapterNums.includes(initialChapterNo)) {
        scrollToTarget();
        return chapterNums;
      }

      if (initialChapterNo === chapterNums[0] - 1) {
        setTimeout(scrollToTarget, 0);
        return [initialChapterNo, ...chapterNums];
      }

      if (initialChapterNo === chapterNums[chapterNums.length - 1] + 1) {
        setTimeout(scrollToTarget, 0);
        return [...chapterNums, initialChapterNo];
      }

      scrollTo(0, 0);

      return [initialChapterNo];
    });

    const scroller$ = fromEvent(scroller, 'scroll').pipe(
      map(() => [scroller.scrollTop, scroller.offsetHeight + scroller.offsetTop] as const)
    );

    const windowScroll$ = fromEvent(window, 'scroll').pipe(
      map(
        () =>
          [
            Math.min(Math.max(0, window.scrollY), document.documentElement.offsetHeight), // Math min/max for safari
            window.innerHeight
          ] as const
      )
    );

    if (bookName) {
      const source$ = merge(scroller$, windowScroll$);

      const scrollDirSubscription = source$
        .pipe(
          map(([scrollTop]) => scrollTop),
          pairwise(),
          map(([prev, curr]) => curr - prev),
          filter(delta => delta !== 0),
          map((delta): ScrollDirection => (delta > 0 ? 'down' : 'up'))
        )
        .subscribe(direction => {
          setShowOverlay(false);
          setScrollDirection(direction);
        });

      const chapterUpdateSubscription = source$
        .pipe(
          distinctUntilChanged(([x], [y]) => x === y),
          map(([scrollTop, offsetHeight]): -1 | 1 | undefined => {
            const target = getTarget(chapterNo);
            if (target) {
              const pos = scrollTop + offsetHeight;
              // Note: should not use both <= and >= for checking
              if (pos < target.offsetTop) {
                return -1;
              } else if (pos >= target.offsetTop + target.offsetHeight + getMarginY(target)) {
                return 1;
              }
            }
          }),
          filter((i): i is -1 | 1 => !!i)
        )
        .subscribe(delta => {
          const newChapterNo = chapterNo + delta;

          if (delta === 1 && hasNext.current && autoFetchNextChapter && loaded.current[chapterNo]) {
            setChapterNums(chapterNums => {
              return chapterNums.includes(newChapterNo) ? chapterNums : [...chapterNums, newChapterNo];
            });
          }

          const newTarget = getTarget(newChapterNo);
          if (newTarget) {
            chapterNo = newChapterNo;
            setCurrentChapter(chapterNo);
            gotoChapter({ provider, bookName, chapterNo }, true).then(() => {
              // remove the record so goback will be correctly
              setRecords(records => {
                return records.slice(0, records.length - 1);
              });
            });
          }
        });

      return () => {
        scrollDirSubscription.unsubscribe();
        chapterUpdateSubscription.unsubscribe();
      };
    }
  }, [bookName, provider, initialChapter, initialChapterNo, autoFetchNextChapter, setRecords]);

  useEffect(() => {
    hasNext.current = !!data[currentChapter]?.nextChapter;
  }, [data, currentChapter]);

  useEffect(() => {
    // document.title = `${bookName} | 第${currentChapter}章 | 睇小說`;
    lastVisitStorage.set(bookName, currentChapter);
  }, [currentChapter, bookName]);

  // disable scroll resotration for page refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      const defaultScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
      return () => {
        window.history.scrollRestoration = defaultScrollRestoration;
      };
    }
  }, []);

  if (bookName) {
    const { name: chapterName } = data[currentChapter] || chapters[currentChapter - 1] || {};
    const prefix = `第${currentChapter}章`;
    const title = `${prefix} ${chapterName}`;
    const content = chapterNums.map(chapterNo => (
      <div
        key={chapterNo}
        // changing id format should also check `preload.js`
        id={`chapter-${chapterNo}`}
        className={classes['content']}
        style={{ fontSize, lineHeight }}
      >
        <ChapterContent
          bookName={bookName}
          provider={provider}
          chapterNo={chapterNo}
          onLoaded={handleChapterLoaded}
          defaultChapter={data[chapterNo]}
        />
      </div>
    ));

    const nextChapter = !autoFetchNextChapter && hasNext.current && loaded.current[currentChapter] && (
      <div className={classes['next-chapter']}>
        <Button
          fill
          text="下一章"
          intent="primary"
          onClick={() => {
            const nextChpaterNo = currentChapter + 1;
            setChapterNums(chapterNums => [...chapterNums, nextChpaterNo]);
          }}
        />
      </div>
    );

    return (
      <div className={[classes['container'], classes[scrollDirection]].join(' ').trim()}>
        <Meta title={`${bookName} | 第${currentChapter}章 | 睇小說`} />
        {/* <FixedChapterName title={title} /> */}
        <ChapterHeader title={title} openPreferences={openPreferences} openChapterListDrawer={_openChapterListDrawer} />
        {/* <ChapterOverlay
          isOpen={showOverlay}
          bookName={bookName}
          goBackButton={goBackButton}
          navigateChapter={navigateChapter}
          openPreferences={openPreferences}
          openChapterListDrawer={_openChapterListDrawer}
          onClose={() => setShowOverlay(false)}
        /> */}
        <div ref={scrollerRef} className={classes['scroller']}>
          <div onClick={() => setShowOverlay(true)}>{content}</div>
          {nextChapter}
        </div>
      </div>
    );
  }

  return null;
}

export function Chapter({
  bookName,
  chapter,
  chapterNo,
  bookName: initialBookName,
  ...props
}: ChapterData & Partial<ChapterParams>) {
  const [preferences, preferencesActions] = usePreferences();
  const handleopenPreferences = () =>
    openPreferences({
      preferences: preferences,
      onUpdate: preferencesActions.update
    });

  return (
    <ChapterComponment
      {...props}
      bookName={bookName}
      chapter={chapter}
      chapterNo={chapterNo}
      preferences={preferences}
      openPreferences={handleopenPreferences}
    />
  );
}

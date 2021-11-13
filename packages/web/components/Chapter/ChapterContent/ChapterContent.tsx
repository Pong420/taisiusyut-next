import React, { useCallback } from 'react';
import { Button, Icon } from '@blueprintjs/core';
import { useRxAsync } from '@/hooks/useRxAsync';
import { useAuthState } from '@/hooks/useAuth';
import { getChapterContent } from '@/service';
import { IChapterContent } from '@/typings';
import classes from './ChapterContent.module.scss';

export interface Props {
  provider: string;
  bookName: string;
  chapterNo: number;
  defaultChapter?: IChapterContent;
  onLoaded: (chapter: IChapterContent) => void;
}

export const ChapterContentLoading = <div className={classes['loading']}>LOADING</div>;

export const ChapterContent = React.memo(({ provider, bookName, chapterNo, onLoaded, defaultChapter }: Props) => {
  const { loginStatus } = useAuthState();
  const waitingAuth = loginStatus === 'unknown' || loginStatus === 'loading';
  const request = useCallback(
    () => getChapterContent({ provider, bookName, chapterNo }),
    [provider, bookName, chapterNo]
  );

  const [{ data: chapter = defaultChapter, error }, { fetch }] = useRxAsync(request, {
    defer: !!defaultChapter || waitingAuth,
    onSuccess: onLoaded
  });

  if (error) {
    const handleRetry = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation(); // avoid trigger showOverlay in `Chapter`
      event.preventDefault();
      fetch();
    };

    return (
      <div className={classes['error']}>
        <div>
          <div>
            <Icon icon="warning-sign" iconSize={50} intent="warning" />
          </div>
          {/* TODO: */}
          <div>{error ? error.message : '未知錯誤'}</div>
          <Button intent="primary" onClick={handleRetry}>
            重試
          </Button>
        </div>
      </div>
    );
  }

  if (chapter) {
    const prefix = `第${chapterNo}章`;

    return (
      <>
        <div className={classes['chapter-name']}>{`${prefix} ${chapter.name}`}</div>
        {chapter.paragraph.map((text, idx) => (
          <div key={idx} className={classes['paragraph']}>
            {text}
          </div>
        ))}
      </>
    );
  }

  return ChapterContentLoading;
});

ChapterContent.displayName = 'ChapterContent';

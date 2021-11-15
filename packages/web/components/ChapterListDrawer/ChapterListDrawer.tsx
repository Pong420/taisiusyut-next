import React, { useEffect, useRef, useState } from 'react';
import { Drawer } from '@blueprintjs/core';
import { ChapterListDrawerContent, ChapterListDrawerContentProps } from './ChapterListDrawerContent';
import { getChapters } from '@/service';
import { IChapter, IGetChapters } from '@/typings';
import { Toaster } from '@/utils/toaster';
import { createOpenOverlay } from '@/utils/openOverlay';
import router from 'next/router';

interface ChapterListDrawerProps extends ChapterListDrawerContentProps {
  isOpen?: boolean;
  onClose: () => void;
  onClosed: () => void;
}

export interface UseChapterListDrawerOptions extends IGetChapters {
  chapterNo?: number;
}

const openChapterListDrawer = createOpenOverlay(ChapterListDrawer);

export function ChapterListDrawer({
  chapterNo,
  isOpen,
  onClose,
  onClosed,
  onItemClick,
  ...props
}: ChapterListDrawerProps) {
  return (
    <Drawer size="auto" isOpen={isOpen} onClose={onClose} onClosed={onClosed}>
      <ChapterListDrawerContent
        {...props}
        chapterNo={chapterNo}
        onItemClick={chapter => {
          onClose();
          onItemClick(chapter);
        }}
      />
    </Drawer>
  );
}

export function useChapterListDrawer(
  { provider, bookName, chapterNo }: UseChapterListDrawerOptions,
  initialValue?: IChapter[]
) {
  const [chapters, setChapters] = useState<Partial<IChapter>[]>(initialValue || Array.from({ length: 30 }, () => ({})));
  const drawer = useRef<ReturnType<typeof openChapterListDrawer>>();

  async function openDrawer() {
    const loaded = !!(chapters.length && chapters[0].name);
    const _handler = openChapterListDrawer({
      chapters,
      chapterNo,
      loading: !loaded,
      onItemClick: chapter => router.replace(`/book/${provider}/${bookName}/${chapter.no || 1}`, undefined),
      onReverse: chapters => {
        _handler.update({ chapters: chapters.slice().reverse() });
      }
    });
    drawer.current = _handler;
  }

  useEffect(() => {
    if (provider && bookName) {
      const request = async () => {
        try {
          const chapters = await getChapters({ provider, bookName });
          setChapters(chapters);
          drawer.current?.update({ chapters, loading: false });
          return chapters;
        } catch (error) {
          Toaster.apiError.bind('Get chapters failure', error as string);
          drawer.current?.update({ chapters: [], loading: false });
        }
      };

      if ('requestIdleCallback' in window && 'cancelIdleCallback' in window) {
        const id = window.requestIdleCallback(request);
        return () => window.cancelIdleCallback(id);
      } else {
        const timeout = setTimeout(request, 2000);
        return () => clearTimeout(timeout);
      }
    }
  }, [provider, bookName]);

  return [openDrawer, chapters] as const;
}

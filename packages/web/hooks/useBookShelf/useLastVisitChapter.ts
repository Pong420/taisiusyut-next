import { useEffect } from 'react';
import { useAuthState } from '@/hooks/useAuth';
import { useBookShelf } from './useBookShelf';
import { BookShelfUID, bookShelfUid } from './bookShelfProvider';
import { lastVistChapter } from '@/service';

export function useLastVisitChapter({ provider, name }: BookShelfUID, chapterNo: number) {
  const [shelf, actions] = useBookShelf();
  const { loginStatus } = useAuthState();
  const uid = bookShelfUid({ provider, name });

  useEffect(() => {
    if (!uid) return;

    const data = shelf.byIds[uid];
    if (data && data?.lastVistChapter !== chapterNo) {
      const timeout = setTimeout(() => {
        actions.update({ uid, lastVistChapter: chapterNo });
        if (loginStatus === 'loggedIn' && data.id) {
          lastVistChapter(data.id, chapterNo).catch(() => void 0);
        }
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [uid, chapterNo, loginStatus, actions, shelf.byIds]);
}

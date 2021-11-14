import { useMemo } from 'react';
import { useRxAsync } from '@/hooks/useRxAsync';
import { IBookShelf } from '@/typings';
import { addBookToShelf, removeBookFromShelf } from '@/service';
import { Toaster } from '@/utils/toaster';
import { useBookShelf } from './useBookShelf';
import { BookShelfUID, bookShelfUid, BookShelf } from './bookShelfProvider';

type AddBook = {
  type: 'add';
  payload: IBookShelf;
};

type RemoveBook = {
  type: 'remove';
  payload: string;
};

export function useBookInShelfToggle({ bookID, ...payload }: BookShelfUID & { bookID: string }) {
  const [state, actions] = useBookShelf();
  const uid = bookShelfUid(payload);
  const shelf: BookShelf | null = state.byIds[uid] || null;
  const { provider } = payload;

  const { request, onSuccess, onFailure } = useMemo(() => {
    return {
      onSuccess: (action: AddBook | RemoveBook) => {
        if (!action) return;
        if (action.type === 'add') {
          const uid = bookShelfUid(action.payload.book);
          actions.insert({ uid, ...action.payload }, 0);
        } else {
          actions.delete({ uid: action.payload });
        }
      },
      onFailure: (error: any) => {
        Toaster.apiError(`Error`, error);
      },
      request: async (shelf: BookShelf | null) => {
        if (shelf) {
          if (shelf.id) {
            await removeBookFromShelf(shelf.id);
          }
          return { type: 'remove', payload: uid };
        }
        const book = await addBookToShelf({ bookID, provider });
        return { type: 'add', payload: book };
      }
    };
  }, [uid, bookID, provider, actions]);

  const [{ loading }, { fetch }] = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure
  });

  return [shelf, loading, fetch] as const;
}

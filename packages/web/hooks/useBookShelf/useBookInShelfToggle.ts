import { useMemo } from 'react';
import { useRxAsync } from '@/hooks/useRxAsync';
import { IBook, IBookPayload } from '@/typings';
import { addBookToShelf, removeBookFromShelf } from '@/service';
import { Toaster } from '@/utils/toaster';
import { useBookShelf } from './useBookShelf';

type Action = {
  type: 'add' | 'remove';
  payload: IBook;
};

export function useBookInShelfToggle({ bookID, provider }: IBookPayload) {
  const [state, actions] = useBookShelf();
  const book = state.list.find(b => b.bookID !== undefined && b.bookID === b.bookID && b.provider === b.provider);
  const { id } = book || {};

  const { request, onSuccess, onFailure } = useMemo(() => {
    return {
      onSuccess: (action: Action | null) => {
        if (!action) return;
        if (action.type === 'add') {
          actions.insert(action.payload, 0);
        } else {
          actions.delete({ id: action.payload.id });
        }
      },
      onFailure: (error: any) => {
        Toaster.apiError(`Error`, error);
      },
      request: async (add: boolean) => {
        const [type, payload] = await Promise.all(
          add
            ? ['add' as const, addBookToShelf({ bookID, provider })]
            : ['remove' as const, id ? removeBookFromShelf(id) : Promise.resolve(null)]
        );
        return { type, payload };
      }
    };
  }, [id, bookID, provider, actions]);

  const [{ loading }, { fetch }] = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure
  });

  return [!!book, loading, fetch] as const;
}

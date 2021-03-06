import { useEffect, useRef } from 'react';
import { AxiosError } from 'axios';
import { EMPTY, fromEvent, merge } from 'rxjs';
import { catchError, distinctUntilChanged, mergeMap, startWith, map, tap } from 'rxjs/operators';
import { createUseCRUDReducer } from '@/hooks/crud-reducer';
import { searchBook } from '@/service';
import { Toaster } from '@/utils/toaster';
import { Search } from './SearchForm';
import { SearchItemProps } from './SearchItem';

type Book = SearchItemProps['book'];

const pageSize = 10;

const placeholder = Array.from<void, Book>({ length: pageSize }, (_, idx) => ({ bookID: String(idx) }));

const useBookReducer = createUseCRUDReducer<Book, 'bookID'>('bookID', {
  initializer: state => ({ ...state, pageSize })
});

export function useSearchResult(search: Search) {
  const [state, actions] = useBookReducer();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      throw new Error(`scroller is not defined`);
    }

    const scroller$ = fromEvent(scroller, 'scroll').pipe(
      map(() => [scroller.scrollTop, scroller.offsetHeight + scroller.offsetTop] as const)
    );

    const windowScroll$ = fromEvent(window, 'scroll').pipe(map(() => [window.scrollY, window.innerHeight] as const));

    let pageNo = 1;

    if (search.value?.trim()) {
      const subscription = merge(scroller$, windowScroll$)
        .pipe(
          startWith([0, 0]),
          map(([scrollTop, offsetHeight]) => {
            const nextIndex = pageNo * pageSize;
            const elements: Element[] = Array.prototype.slice.call(scroller.children, nextIndex);
            const target = elements.find((e): e is HTMLElement => e instanceof HTMLElement);
            if (target && scrollTop + offsetHeight >= target.offsetTop) {
              pageNo += 1;
            }
            return pageNo;
          }),
          distinctUntilChanged(),
          tap(pageNo => {
            if (pageNo === 1) {
              // reset scroll position
              window.scrollTo(0, 0);
              scroller.scrollTop = 0;
              actions.list(placeholder);
            }
          }),
          mergeMap(() => searchBook(search)),
          catchError((error: AxiosError) => {
            if (error.config.params?.pageNo === 1) {
              actions.list([]);
            }
            Toaster.apiError(`Search books failure`, error);
            return EMPTY;
          })
        )
        .subscribe(payload => {
          // TODO: pagination
          if (Array.isArray(payload)) {
            actions.list(payload);
          } else {
            actions.paginate(payload);
          }
        });
      return () => subscription.unsubscribe();
    } else {
      // for clear search result
      actions.list([]);
    }
  }, [actions, search]);

  return { state, scrollerRef };
}

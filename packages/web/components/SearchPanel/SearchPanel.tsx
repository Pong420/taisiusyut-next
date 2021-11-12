import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '@/components/Layout/Header';
import { ButtonPopover } from '@/components/ButtonPopover';
import { ISearchResult } from '@/typings';
import { Search, SearchForm, useForm, transoform } from './SearchForm';
import { useSearchResult } from './useSearchResult';
import { SearchItem } from './SearchItem';
import classes from './SearchPanel.module.scss';

export interface SearchPanelProps {
  onLeave?: () => void;
}

export function SearchPanel({ onLeave }: SearchPanelProps) {
  const router = useRouter();
  const { asPath, query } = router;
  const [form] = useForm();
  const [search, setSearch] = useState(() => transoform(asPath.startsWith('/search') ? query : {}));
  const { state, scrollerRef } = useSearchResult(search);

  const handleSearch = (search: Search) => {
    setSearch(search);
    router.push(
      {
        pathname: '/search',
        query: { q: search.value }
      },
      undefined,
      { shallow: true }
    );
  };

  const items = state.list.map(book => <SearchItem key={book.bookID} book={book as ISearchResult} />);

  useEffect(() => {
    form.setFieldsValue(search);
  }, [search, form]);

  useEffect(() => {
    if (asPath.startsWith('/search')) {
      setSearch(search => {
        const newSearch = transoform(query);
        const hasChange = search.value !== newSearch.value;
        return hasChange ? newSearch : search;
      });
    }
  }, [asPath, query]);

  return (
    <div className={classes['panel']}>
      <Header title="搜索書籍" left={<ButtonPopover minimal icon="cross" content="取消搜索" onClick={onLeave} />} />
      <div className={classes['content']}>
        <SearchForm form={form} onFinish={handleSearch} />
        <div className={classes['items']} ref={scrollerRef}>
          <div className={classes['border']} />
          {items}
        </div>
      </div>
    </div>
  );
}

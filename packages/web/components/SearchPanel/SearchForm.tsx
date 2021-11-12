import React, { useEffect, useRef } from 'react';
import { fromEvent } from 'rxjs';
import { bufferCount, switchMap, takeUntil } from 'rxjs/operators';
import { Button } from '@blueprintjs/core';
import { Input } from '@/components/Input';
import { createForm, FormProps } from '@/utils/form';
import classes from './SearchPanel.module.scss';

export interface Search {
  value: string;
}

interface Props extends FormProps<Search> {}

const { Form, FormItem, useForm } = createForm<Search>({ noStyle: true });

export { useForm };

export const transoform = (query: Record<string, any>): Search => {
  return { value: query.q };
};

export function SearchForm(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // trigger `input.blur()` on scroll, for mobile device
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      const subscription = fromEvent(input, 'focus')
        .pipe(switchMap(() => fromEvent(window, 'scroll').pipe(bufferCount(5, 1), takeUntil(fromEvent(input, 'blur')))))
        .subscribe(() => input.blur());
      return () => subscription.unsubscribe();
    }
  }, []);

  return (
    <Form
      {...props}
      className={classes['search-field']}
      onFinish={payload => {
        props.onFinish && props.onFinish(payload);
        inputRef.current?.blur();
      }}
    >
      <FormItem name="value">
        <Input autoFocus inputRef={inputRef} rightElement={<Button icon="search" minimal type="submit" />} />
      </FormItem>
    </Form>
  );
}

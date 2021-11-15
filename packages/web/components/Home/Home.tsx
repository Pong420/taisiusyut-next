import React from 'react';
import router from 'next/router';
import { Header } from '@/components/Layout/Header';
import { Github } from '@/components/Icon/Github';
import { Button } from '@blueprintjs/core';
import { Input } from '@/components/Input';
import { createForm } from '@/utils/form';
import { repositoryUrl } from '@/utils/repo';
import classes from './Home.module.scss';

const { Form, FormItem } = createForm<{ q: string }>();

export function Home() {
  return (
    <>
      <Header position="right" />

      <div className={classes['content']}>
        <div className={classes['title']}>Tai siu syut</div>
        <Form onFinish={query => router.push({ pathname: '/search', query })} className={classes['form']}>
          <FormItem name="q" noStyle>
            <Input
              fill
              round
              large
              placeholder="輸入作者/書籍名稱 ..."
              leftElement={<Button icon="search" minimal type="submit" />}
            />
          </FormItem>
        </Form>

        <a href={repositoryUrl} target="_blank" rel="noreferrer">
          <Github width="30" height="30" />
        </a>
      </div>
    </>
  );
}

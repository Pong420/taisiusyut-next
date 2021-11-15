import React from 'react';
import router from 'next/router';
import Image from 'next/image';
import { Header } from '@/components/Layout/Header';
import { Github } from '@/components/Icon/Github';
import { Input } from '@/components/Input';
import { MainMenuButton } from '@/components/MainMenuOverlay';
import { createForm } from '@/utils/form';
import { repositoryUrl } from '@/utils/repo';
import { withBreakPoint } from '@/hooks/useBreakPoints';
import classes from './Home.module.scss';

const { Form, FormItem } = createForm<{ q: string }>();

const MobileMainMenuButton = withBreakPoint(MainMenuButton, {
  validate: breakPoint => breakPoint <= 768
});

const imageSize = 100;

export function Home() {
  return (
    <>
      <Header position="right" left={<MobileMainMenuButton />} />

      <div className={classes['content']}>
        <div className={classes['head']}>
          {/* <Logo /> */}
          <Image src="/logo.png" alt="logo" width={imageSize} height={imageSize} priority unoptimized />
          <div className={classes['title']}>Tai siu syut</div>
          <Form onFinish={query => router.push({ pathname: '/search', query })} className={classes['form']}>
            <FormItem name="q" noStyle>
              <Input fill round large placeholder="輸入作者/書籍名稱 ..." style={{ textAlign: 'center' }} />
            </FormItem>
          </Form>
        </div>

        <a href={repositoryUrl} target="_blank" rel="noreferrer">
          <Github width="30" height="30" />
        </a>
      </div>
    </>
  );
}

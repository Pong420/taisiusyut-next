import React from 'react';
import { Header } from '@/components/Layout/Header';
import { ButtonPopover } from '@/components/ButtonPopover';
import { withMainMenuOverLay, MainMenuOverlayIcon } from '@/components/MainMenuOverlay';
import classes from './BookShelf.module.scss';

const MainMenuButton = withMainMenuOverLay(ButtonPopover);

export function BookShelf() {
  return (
    <div className={classes['shelf']}>
      <Header className={classes['header']} title="書架" left={<MainMenuButton minimal icon={MainMenuOverlayIcon} />} />
    </div>
  );
}

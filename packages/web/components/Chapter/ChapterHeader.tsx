import React, { ReactElement } from 'react';
import { ButtonPopover } from '@/components/ButtonPopover';
import { Header, HeaderProps } from '@/components/Layout/Header';
import { PreferencesOverlayIcon, PreferencesOverlayTitle } from '@/components/PreferencesOverlay';
import classes from './Chapter.module.scss';

interface Props extends HeaderProps {
  goBackButton: ReactElement;
  openPreferences?: () => void;
  openChapterListDrawer?: () => void;
}

export function ChapterHeader({ goBackButton, openPreferences, openChapterListDrawer, ...props }: Props) {
  return (
    <Header
      {...props}
      position="right"
      className={classes['header']}
      left={goBackButton}
      right={[
        <ButtonPopover
          key="0"
          minimal
          icon={PreferencesOverlayIcon}
          content={PreferencesOverlayTitle}
          onClick={openPreferences}
        />,
        <ButtonPopover key="1" minimal icon="properties" content="章節目錄" onClick={openChapterListDrawer} />
      ]}
    />
  );
}

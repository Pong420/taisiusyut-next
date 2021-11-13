import React from 'react';
import { ButtonPopover } from '@/components/ButtonPopover';
import { Header, HeaderProps } from '@/components/Layout/Header';
import { GoBackButton } from '@/components/GoBackButton';
import { PreferencesOverlayIcon, PreferencesOverlayTitle } from '@/components/PreferencesOverlay';
import classes from './Chapter.module.scss';

interface Props extends HeaderProps {
  openPreferences?: () => void;
  openChapterListDrawer?: () => void;
}

export function ChapterHeader({ openPreferences, openChapterListDrawer, ...props }: Props) {
  return (
    <Header
      {...props}
      className={classes['header']}
      left={<GoBackButton targetPath={['/', `/book/:provider/:bookName`]} />}
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

import React from 'react';
import router from 'next/router';
import { Button, Icon, IconProps, OverlayProps, Overlay } from '@blueprintjs/core';
import { PreferencesOverlayIcon, PreferencesOverlayTitle } from '@/components/PreferencesOverlay';
import { withBreakPoint } from '@/hooks/useBreakPoints';
import classes from './ChapterOverlay.module.scss';

interface Props extends OverlayProps {
  provider: string;
  bookName: string;
  nextChapter?: boolean;
  goBackButton: React.ReactElement;
  navigateChapter: (factor: 1 | -1) => void;
  openPreferences?: () => void;
  openChapterListDrawer?: () => void;
}

type DivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface ItemProps extends DivProps {
  icon?: IconProps['icon'];
  isActive?: boolean;
}

function Item({ icon, children, isActive, ...props }: ItemProps) {
  return (
    <div {...props} className={[classes['item'], isActive ? classes['active'] : ''].join(' ').trim()}>
      <Icon icon={icon} />
      <div className={classes['text']}>{children}</div>
    </div>
  );
}

function ChapterOverlayBase({
  provider,
  bookName,
  goBackButton,
  nextChapter,
  navigateChapter,
  openPreferences,
  openChapterListDrawer,
  ...props
}: Props) {
  return (
    <Overlay {...props} hasBackdrop={false} className={classes['overlay']}>
      <div className={classes['content']} onClick={props.onClose}>
        <div className={classes['top']}>{goBackButton}</div>
        <div className={classes['bottom']}>
          <div className={classes['bottom-head']}>
            <Button minimal onClick={() => navigateChapter(-1)}>
              上一章
            </Button>
            {nextChapter ? (
              <Button minimal onClick={() => navigateChapter(1)}>
                下一章
              </Button>
            ) : (
              <Button minimal onClick={() => router.push(`/`)}>
                返回書架
              </Button>
            )}
          </div>
          <div className={classes['bottom-content']}>
            <Item icon="home" onClick={() => router.push(`/`)}>
              書架
            </Item>
            <Item icon="book" onClick={() => router.push(`/book/${provider}/${bookName}`)}>
              詳情
            </Item>
            <Item icon={PreferencesOverlayIcon} onClick={openPreferences}>
              {PreferencesOverlayTitle}
            </Item>
            <Item icon="properties" onClick={openChapterListDrawer}>
              目錄
            </Item>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

export const ChapterOverlay = withBreakPoint(ChapterOverlayBase, {
  validate: breakPoint => breakPoint <= 768
});

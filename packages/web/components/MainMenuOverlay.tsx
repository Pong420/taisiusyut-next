import React from 'react';
import router from 'next/router';
import { Icon } from '@blueprintjs/core';
import {
  ListItem,
  ListSpacer,
  ListViewFooter,
  ListViewDialogProps,
  ListViewOverlay
} from '@/components/ListViewOverlay';
import { openPreferences, PreferencesOverlayIcon, PreferencesOverlayTitle } from '@/components/PreferencesOverlay';
import { openProfileOverlay, ProfileOverlayIcon, ProfileOverlayTitle } from '@/components/ProfileOverlay';
import { Github } from '@/components/Icon/Github';
import { useBoolean } from '@/hooks/useBoolean';
import { useAuth } from '@/hooks/useAuth';
import { usePreferences } from '@/hooks/usePreferences';
import { repositoryUrl } from '@/utils/repo';
import { withAuthRequired } from './withAuthRequired';

interface MainMenuDialogProps extends ListViewDialogProps {}

interface OnClick {
  onClick?: (event: React.MouseEvent<any>) => void;
}

const chevron = <Icon icon="chevron-right" />;

const AuthrizedListItem = withAuthRequired(ListItem);

export const MainMenuOverlayIcon = 'menu';
export const MainMenuOverlayTitle = '主選單';

export function MainMenuOverlay(props: MainMenuDialogProps) {
  const [auth, authActions] = useAuth();
  const [preferences, preferncesActions] = usePreferences();

  return (
    <ListViewOverlay {...props} icon={MainMenuOverlayIcon} title={MainMenuOverlayTitle}>
      <ListSpacer />

      <AuthrizedListItem
        icon={ProfileOverlayIcon}
        rightElement={
          <div>
            <span style={{ marginRight: 5 }}>{auth.user?.nickname || '登入 / 註冊'}</span>
            {chevron}
          </div>
        }
        onClick={() => openProfileOverlay({ auth, actions: authActions })}
      >
        {ProfileOverlayTitle}
      </AuthrizedListItem>

      <ListItem
        icon={PreferencesOverlayIcon}
        rightElement={chevron}
        onClick={() =>
          openPreferences({
            preferences,
            onUpdate: preferncesActions.update
          })
        }
      >
        {PreferencesOverlayTitle}
      </ListItem>

      <ListItem
        icon="search"
        rightElement={chevron}
        onClick={() => {
          props.onClose();
          router.push('/search');
        }}
      >
        搜索書籍
      </ListItem>

      {repositoryUrl && (
        <ListItem icon={<Github />} rightElement={chevron} onClick={() => window.open(repositoryUrl)}>
          Github
        </ListItem>
      )}

      <ListSpacer />

      <ListItem icon="code" rightElement={<div>1.0.0</div>}>
        Version
      </ListItem>

      <ListViewFooter onClose={props.onClose}></ListViewFooter>
    </ListViewOverlay>
  );
}

export function withMainMenuOverLay<P extends OnClick>(Component: React.ComponentType<P>) {
  return function WithMainMenuOverLay(props: P) {
    const [isOpen, open, close] = useBoolean();
    return (
      <>
        <Component {...props} onClick={open} />
        <MainMenuOverlay isOpen={isOpen} onClose={close} />
      </>
    );
  };
}

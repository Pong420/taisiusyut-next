import React from 'react';
import { Button, Icon } from '@blueprintjs/core';
import {
  ListViewOverlay,
  ListViewOverlayProps,
  ListItem,
  ListSpacer,
  ListViewFooter
} from '@/components/ListViewOverlay';
import { openModifyPasswordOverlay } from './ModifyPasswordOverlay';
import { openProfileUpdateOverlay } from './ProfileUpdateOverlay';
import { AuthState, AuthActions } from '@/hooks/useAuth';
import { createOpenOverlay } from '@/utils/openOverlay';
import dayjs from 'dayjs';

export interface ProfileOverlayProps extends ListViewOverlayProps {
  auth: AuthState;
  actions: AuthActions;
}

const chevron = <Icon icon="chevron-right" />;

export const openProfileOverlay = createOpenOverlay(ProfileOverlay);

export const ProfileOverlayIcon = 'user';
export const ProfileOverlayTitle = '帳號';

export function ProfileOverlay({ auth, actions, ...props }: ProfileOverlayProps) {
  if (auth.loginStatus !== 'loggedIn') {
    return null;
  }

  return (
    <ListViewOverlay {...props} icon={ProfileOverlayIcon} title={ProfileOverlayTitle}>
      <ListSpacer />

      <ListItem rightElement={auth.user.nickname}>暱稱</ListItem>

      <ListItem rightElement={dayjs(auth.user.createdAt).format(`YYYY年MM日DD日`)}>註冊日期</ListItem>

      <ListSpacer />

      <ListItem rightElement={chevron} onClick={() => openModifyPasswordOverlay({ logout: actions.logout })}>
        更改密碼
      </ListItem>

      <ListItem rightElement={chevron} onClick={() => openProfileUpdateOverlay({ auth, actions })}>
        更改帳號資料
      </ListItem>

      <ListViewFooter onClose={props.onClose}>
        <Button
          fill
          text="登出"
          intent="danger"
          onClick={() => {
            actions.logout();
            props.onClose && props.onClose();
          }}
        />
      </ListViewFooter>
    </ListViewOverlay>
  );
}

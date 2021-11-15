import React, { useEffect, useState } from 'react';
import { Button, Icon } from '@blueprintjs/core';
import {
  ListViewOverlay,
  ListViewOverlayProps,
  ListItem,
  ListSpacer,
  ListViewFooter
} from '@/components/ListViewOverlay';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { RegistrationForm, createUserForm } from '@/components/UserForm';
import { Logo } from '@/components/Logo';
import { openModifyPasswordOverlay } from './ModifyPasswordOverlay';
import { openProfileUpdateOverlay } from './ProfileUpdateOverlay';
import { AuthState, AuthActions } from '@/hooks/useAuth';
import { createOpenOverlay, OverlayHandler } from '@/utils/openOverlay';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { guestConnect } from '@/service';
import { IProfile } from '@/typings';
import dayjs from 'dayjs';

export interface ProfileOverlayProps extends ListViewOverlayProps {
  auth: AuthState;
  actions: AuthActions;
}

const chevron = <Icon icon="chevron-right" />;

const { useForm } = createUserForm();

let handler: OverlayHandler<ProfileOverlayProps> | undefined;
export const openProfileOverlay = (props: ProfileOverlayProps) => {
  handler = createOpenOverlay(ProfileOverlay)(props);
  return handler;
};

export const ProfileOverlayIcon = 'user';
export const ProfileOverlayTitle = '帳號';

function CopyUIDItem({ uid }: { uid?: string }) {
  const DEFAULT = '複製登入代碼';
  const [text, setText] = useState(DEFAULT);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (text !== DEFAULT) {
      timeout = setTimeout(() => setText(DEFAULT), 1000);
    }
    return () => clearTimeout(timeout);
  }, [text]);

  if (!uid) return null;

  return (
    <ListItem rightElement={chevron} onClick={() => copyToClipboard(uid).then(() => setText('複製成功'))}>
      {text}
    </ListItem>
  );
}

function RegistrationItem({ actions }: { actions: AuthActions }) {
  const [form] = useForm();

  async function handleSubmit() {
    const payload = await form.validateFields();
    const user = await guestConnect(payload);
    actions.updateProfile({ ...user, guest: undefined });
  }

  function onClick() {
    openConfirmDialog({
      icon: 'user',
      title: '正式註冊',
      confirmText: '註冊',
      cancelText: '關閉',
      onConfirm: handleSubmit,
      style: { width: '300px' },
      children: <RegistrationForm form={form} head={<Logo />} />
    });
  }

  return (
    <ListItem rightElement={chevron} onClick={onClick}>
      正式註冊
    </ListItem>
  );
}

export function ProfileOverlay({ auth, actions, ...props }: ProfileOverlayProps) {
  useEffect(() => {
    const updateProfile = actions.updateProfile;
    actions.updateProfile = function (user: Partial<IProfile>) {
      updateProfile(user);
      auth.user && handler?.update({ auth: { ...auth, user: { ...auth.user, ...user } } });
    };
  }, []); // eslint-disable-line

  if (auth.loginStatus !== 'loggedIn') {
    return null;
  }

  const guest = !!auth.user.guest;

  return (
    <ListViewOverlay {...props} icon={ProfileOverlayIcon} title={ProfileOverlayTitle}>
      <ListSpacer />

      <ListItem rightElement={auth.user.nickname}>暱稱</ListItem>

      <ListItem rightElement={dayjs(auth.user.createdAt).format(`YYYY年MM日DD日`)}>註冊日期</ListItem>

      {guest && <RegistrationItem actions={actions} />}

      {guest && <CopyUIDItem uid={auth.user.username} />}

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

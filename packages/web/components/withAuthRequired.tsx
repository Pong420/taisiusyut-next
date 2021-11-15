import React, { useRef } from 'react';
import { Button } from '@blueprintjs/core';
import { openConfirmDialog, ConfirmDialogProps } from '@/components/ConfirmDialog';
import { Logo } from '@/components/Logo';
import { createUserForm, RegistrationForm, LoginForm } from '@/components/UserForm';
import { useAuth } from '@/hooks/useAuth';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { GuestOverlayTitle, openGuestOverlay } from './GuestOverlay';

export interface OnClick {
  onClick?: (event: React.MouseEvent<any>) => void;
}

const { useForm } = createUserForm();

const dialogProps: Partial<ConfirmDialogProps> = {
  icon: 'user',
  style: { width: 320 }
};

export function withAuthRequired<P extends OnClick>(Component: React.ComponentType<P>) {
  return function OpenLoginDialog(props: P) {
    const [form] = useForm();
    const [{ loginStatus }, { authenticate }] = useAuth();
    const dialog = useRef<ReturnType<typeof openConfirmDialog>>();

    function handleConfirm() {
      return async () => {
        const payload = await form.validateFields();
        await lastValueFrom(authenticate(payload));
      };
    }

    function handleRegistration() {
      form.resetFields();
      dialog.current = openConfirmDialog({
        ...dialogProps,
        onCancel: handleLogin,
        onConfirm: handleConfirm(),
        title: '會員註冊',
        confirmText: '註冊',
        cancelText: '已有帳號',
        children: <RegistrationForm form={form} head={<Logo />} />
      });
    }

    function handleGuestLogin() {
      dialog.current?.destroy();
      openGuestOverlay({
        head: <Logo />,
        login: payload => firstValueFrom(authenticate(payload))
      });
    }

    function handleLogin() {
      form.resetFields();
      dialog.current = openConfirmDialog({
        ...dialogProps,
        onCancel: handleRegistration,
        onConfirm: handleConfirm(),
        title: '會員登入',
        confirmText: '登入',
        cancelText: '註冊帳號',
        children: (
          <>
            <LoginForm form={form} head={<Logo />} />
            <Button fill outlined onClick={handleGuestLogin}>
              {GuestOverlayTitle}
            </Button>
          </>
        )
      });
    }

    return (
      <Component {...(props as unknown as P)} onClick={loginStatus === 'loggedIn' ? props.onClick : handleLogin} />
    );
  };
}

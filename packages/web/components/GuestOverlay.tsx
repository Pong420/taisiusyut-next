import React, { useEffect, useRef } from 'react';
import { Card } from '@blueprintjs/core';
import { ConfirmDialogProps, openConfirmDialog } from '@/components/ConfirmDialog';
import { Input } from '@/components/Input';
import { createForm } from '@/utils/form';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { createOpenOverlay } from '@/utils/openOverlay';
import { guestRegister } from '@/service';
import { IAuthenticated, IGuestLogin } from '@/typings';

export interface GuestOverlayProps extends Omit<ConfirmDialogProps, 'onSuccess'> {
  head?: React.ReactNode;
  login: (payload: IGuestLogin) => Promise<IAuthenticated>;
}

export const GuestOverlayTitle = `訪客登入`;

const contents = [
  '訪客登陸會隨機生成一串代碼，代碼可以重覆或者使用不同裝置登入',
  '請保管好你的代碼，遺失後將無法找回',
  '持續一段時間沒有登入的訪客帳號，可能會被刪除',
  '訪客帳號可以轉為正式帳號，書架等資料會被保留'
];

const { Form, FormItem, useForm } = createForm<IGuestLogin>();

export const openGuestOverlay = createOpenOverlay(GuestOverlay);

export function GuestOverlay({ head, login }: GuestOverlayProps) {
  const dialog = useRef<ReturnType<typeof openConfirmDialog>>();

  const docs = (
    <ol style={{ paddingLeft: 20, maxWidth: 280 }}>
      {contents.map((text, idx) => (
        <li key={text} style={{ marginTop: idx && 10 }}>
          {text}
        </li>
      ))}
    </ol>
  );

  const onRegistration = async () => {
    const user = await guestRegister();
    const uid = user.username;
    await login({ uid });
    handleRegistrationSuccess(uid);
  };

  const handleRegistration = () => {
    dialog.current = openConfirmDialog({
      title: '訪客註冊',
      icon: 'user',
      confirmText: '註冊帳號',
      cancelText: '已有帳號',
      onConfirm: onRegistration,
      onCancel: handleLogin,
      children: (
        <>
          {head}
          {docs}
        </>
      )
    });
  };

  const [form] = useForm();
  const formComponent = (
    <Form form={form}>
      <FormItem name="uid" label="登入代碼">
        <Input />
      </FormItem>
    </Form>
  );

  const onLogin = async () => {
    const { uid } = await form.validateFields();
    await login({ uid });
  };

  const handleLogin = () => {
    dialog.current = openConfirmDialog({
      title: GuestOverlayTitle,
      icon: 'user',
      confirmText: '訪客登入',
      cancelText: '訪客註冊',
      onConfirm: onLogin,
      onCancel: handleRegistration,
      children: (
        <>
          {head}
          {formComponent}
        </>
      )
    });
  };

  const handleRegistrationSuccess = (uid: string) => {
    let timeout: NodeJS.Timeout;
    const onConfirm = async () => {
      clearTimeout(timeout);
      await copyToClipboard(uid);
      dialog.current?.update({ intent: 'success', confirmText: '複製成功' });
      timeout = setTimeout(() => dialog.current?.update({ intent: 'primary', confirmText: '複製' }), 1000);
    };

    dialog.current = openConfirmDialog({
      title: '註冊成功',
      icon: 'tick',
      confirmText: '複製',
      cancelText: '關閉',
      onSuccess: () => void 0,
      onConfirm,
      children: (
        <>
          {head}
          <div style={{ textAlign: 'center', marginBottom: 10 }}>登入代碼</div>
          <Card style={{ textAlign: 'center', padding: 10 }}>{uid}</Card>
        </>
      )
    });
  };

  useEffect(() => {
    dialog.current?.destroy();
    handleLogin();
  }, []); // eslint-disable-line

  return null;
}

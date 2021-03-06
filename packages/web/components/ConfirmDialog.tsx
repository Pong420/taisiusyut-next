import React from 'react';
import { useRxAsync } from '@/hooks/useRxAsync';
import { Button, Classes, Intent, Dialog, DialogProps } from '@blueprintjs/core';
import { createOpenOverlay } from '@/utils/openOverlay';

export interface ConfirmDialogProps extends DialogProps {
  children?: React.ReactNode;
  intent?: Intent;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => Promise<unknown>;
  onCancel?: () => unknown | Promise<unknown>;
  onSuccess?: () => void;
  onClose?: () => void;
  loading?: boolean;
}

const asyncFn = () => Promise.resolve();

export function createConfirmDialog<P extends DialogProps>(Component: React.ComponentType<P>) {
  return function ConfirmDialog({
    className = '',
    children,
    onClose,
    onConfirm,
    onCancel,
    onSuccess = onClose,
    loading: loadingFromProps,
    confirmText = '確認',
    cancelText = '取消',
    intent = 'primary',
    ...props
  }: P & ConfirmDialogProps) {
    const [{ loading }, { fetch }] = useRxAsync(onConfirm || asyncFn, {
      defer: true,
      onSuccess
    });
    const isLoading = loadingFromProps || loading;

    async function handleCancel() {
      const cancel = onCancel && onCancel();
      await cancel;
      onClose && onClose();
    }

    return (
      <Component
        {...(props as P)}
        onClose={onClose}
        canEscapeKeyClose={!isLoading}
        canOutsideClickClose={!isLoading}
        className={className}
      >
        <div className={Classes.DIALOG_BODY}>{children}</div>
        <div className={Classes.DIALOG_FOOTER}>
          <div>
            <Button fill intent={intent} onClick={fetch} loading={isLoading}>
              {confirmText}
            </Button>
            <div style={{ margin: '10px 0' }}></div>
            <Button fill disabled={isLoading} onClick={handleCancel}>
              {cancelText}
            </Button>
          </div>
        </div>
      </Component>
    );
  };
}

export const ConfirmDialog = createConfirmDialog(Dialog);

export const openConfirmDialog = createOpenOverlay<ConfirmDialogProps>(ConfirmDialog);

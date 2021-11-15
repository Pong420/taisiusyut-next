import React, { ComponentType, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { OverlayProps as BpOverlayProps } from '@blueprintjs/core';

interface OverlayProps extends BpOverlayProps {
  children?: ReactNode;
}

export interface OverlayHandler<T> {
  update: (newConfig: Partial<T>) => void;
  destroy: () => void;
}

export type OpenOverlayProps<T> = Omit<T, keyof OverlayProps> & Partial<OverlayProps>;

export function createOpenOverlay<T extends Partial<OverlayProps>>(OverlayComponent: ComponentType<T>) {
  return function openOverlay(config = {} as OpenOverlayProps<T>) {
    const div = document.createElement('div');
    document.body.appendChild(div);

    let currentConfig: Omit<T, keyof OverlayProps> & Partial<OverlayProps> = {
      ...config,
      onClose: (...args) => {
        config?.onClose && config.onClose(...args);
        close();
      },
      onClosed: (...args) => {
        config?.onClosed && config.onClosed(...args);
        destroy();
      },
      isOpen: true
    };

    function destroy() {
      const unmountResult = ReactDOM.unmountComponentAtNode(div);
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div);
      }
    }

    function render({ children, ...props }: any) {
      ReactDOM.render(React.createElement(OverlayComponent, { ...props }, children), div);
    }

    function close() {
      currentConfig = {
        ...currentConfig,
        isOpen: false
      };
      render(currentConfig);
    }

    function update(newConfig: Partial<T>) {
      currentConfig = {
        ...currentConfig,
        ...newConfig
      };
      render(currentConfig);
    }

    render(currentConfig);

    const handler: OverlayHandler<T> = {
      destroy: close,
      update
    };

    return handler;
  };
}

import React, { useEffect, useState } from 'react';
import { Button, ButtonProps } from '@blueprintjs/core';
import { Popover2, Popover2Props } from '@blueprintjs/popover2';
import { isTouchable } from '@/utils/isTouchable';

export interface ButtonPopoverProps extends ButtonProps, Pick<Popover2Props, 'position' | 'content'> {
  popoverProps?: Popover2Props;
}

function ButtonPopoverBase(
  { popoverProps, content, disabled, position = 'bottom', ...props }: ButtonPopoverProps,
  ref?: React.LegacyRef<Button>
) {
  const [disablePopover, setDisablePopover] = useState(false);
  const button = <Button ref={ref} disabled={disabled} {...props} />;

  useEffect(() => {
    setDisablePopover(isTouchable());
  }, []);

  return content && !disablePopover ? (
    <Popover2
      popoverClassName={'button-popover'}
      interactionKind="hover-target"
      hoverOpenDelay={0}
      hoverCloseDelay={0}
      content={content}
      position={position}
      disabled={disabled}
      {...popoverProps}
    >
      {button}
    </Popover2>
  ) : (
    button
  );
}

export const ButtonPopover = React.forwardRef(ButtonPopoverBase);

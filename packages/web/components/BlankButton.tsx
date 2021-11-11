import React from 'react';
import { Button } from '@blueprintjs/core';

const style: React.CSSProperties = { visibility: 'hidden' };

export function BlankButton() {
  return <Button minimal icon="blank" style={style} />;
}

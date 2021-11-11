import React from 'react';
import { TagInput as Bp3TagInput, TagInputProps as BpTagInputProps } from '@blueprintjs/core';

export interface TagInputProps extends Partial<BpTagInputProps> {}

export function TagInput(props?: TagInputProps) {
  return (
    <Bp3TagInput
      fill
      {...props}
      {...(props && props.onChange && Array.isArray(props.values) ? { values: props.values } : { values: [] })}
    />
  );
}

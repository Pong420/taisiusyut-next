import React from 'react';
import { InputGroup, TextArea as BpTextArea, TextAreaProps, InputGroupProps, HTMLInputProps } from '@blueprintjs/core';

export interface InputProps
  extends InputGroupProps,
    Omit<HTMLInputProps, 'value' | 'defaultValue' | 'onChange' | 'type'> {}

export function Input(props?: InputProps) {
  return (
    <InputGroup
      fill
      autoComplete="off"
      {...props}
      {...(props && props.onChange && typeof props.value === 'undefined' && { value: '' })}
    />
  );
}

export function TextArea(props?: TextAreaProps) {
  return (
    <BpTextArea
      fill
      autoComplete="off"
      {...props}
      {...(props && props.onChange && typeof props.value === 'undefined' && { value: '' })}
    />
  );
}

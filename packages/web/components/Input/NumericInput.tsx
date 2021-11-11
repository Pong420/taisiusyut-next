import React from 'react';
import { NumericInput as BpNumericInput, NumericInputProps } from '@blueprintjs/core';

export function NumericInput({
  onValueChange,
  onChange,
  ...props
}: NumericInputProps & {
  onChange?: (payload: number | string) => void;
} = {}) {
  return (
    <BpNumericInput
      clampValueOnBlur
      autoComplete="off"
      allowNumericCharactersOnly={false}
      {...props}
      {...(props && onChange && typeof props.value === 'undefined' && { value: '' })}
      onValueChange={(num, raw) => onChange && onChange(isNaN(num) ? raw : num)}
    />
  );
}

import React from 'react';
import { createUserForm, UserFormProps } from './UserForm';

interface Props extends UserFormProps {
  head?: React.ReactNode;
}

const { Form, Username, Email, Password, ConfirmPassword } = createUserForm();

export function RegistrationForm({ head, children, ...props }: Props) {
  return (
    <Form {...props}>
      {head}

      <Email />

      <Username />

      <Password autoComplete="new-password" deps={['username']} />

      <ConfirmPassword autoComplete="new-password" />

      {children}
    </Form>
  );
}

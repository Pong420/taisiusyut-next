import React from 'react';
import { createUserForm, userValidators, UserFormProps } from './UserForm';

interface Props extends UserFormProps {
  head?: React.ReactNode;
}

const { Form, Username, Email, Password, ConfirmPassword } = createUserForm();

export function RegistrationForm({ head, children, ...props }: Props) {
  return (
    <Form {...props}>
      {head}

      <Email />

      <Username validators={[userValidators.username.required, userValidators.username.format]} />

      <Password
        autoComplete="new-password"
        deps={['username']}
        validators={({ username }) => [
          userValidators.password.required,
          userValidators.password.format,
          userValidators.password.equalToUsername(username)
        ]}
      />

      <ConfirmPassword autoComplete="new-password" />

      {children}
    </Form>
  );
}

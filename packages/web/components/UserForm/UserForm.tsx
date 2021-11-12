import React from 'react';
import { createForm, FormProps, FormItemProps, validators } from '@/utils/form';
import { IRegister, ILogin } from '@/typings';
import { Input, InputProps, Password as PasswordInput } from '../Input';

type UserFormSchema = IRegister & ILogin & { confirmNewPassword: string };

export type UserFormProps = FormProps<UserFormSchema>;
export type UserFormInstance = NonNullable<FormProps<UserFormSchema>['form']>;
export type UserFormItemProps = FormItemProps<UserFormSchema> & {
  large?: boolean;
};

type PasswordFormItemProps = UserFormItemProps & {
  visible?: boolean;
  autoComplete?: InputProps['autoComplete'];
};

export function createUserForm({ large = false, ...itemProps }: UserFormItemProps = {}) {
  const components = createForm<UserFormSchema>(itemProps);
  const { FormItem } = components;

  const Username = ({ label = 'Username', ...props }: UserFormItemProps) => (
    <FormItem {...props} name="username" label={label}>
      <Input large={large} autoComplete="username" />
    </FormItem>
  );

  const Password = ({ visible, autoComplete, label = 'Password', ...props }: PasswordFormItemProps = {}) => (
    <FormItem {...props} name="password" label={label}>
      <PasswordInput large={large} visible={visible} autoComplete={autoComplete} />
    </FormItem>
  );

  const Email = ({ label = 'Email', ...props }: UserFormItemProps = {}) => (
    <FormItem
      {...props}
      name="email"
      label={label}
      validators={[validators.required('Please input an email'), validators.emailFormat()]}
    >
      <Input large={large} autoComplete="email" type="email" />
    </FormItem>
  );

  const ConfirmPassword = ({
    visible,
    autoComplete = 'new-password',
    label = 'Confirm Password'
  }: PasswordFormItemProps) => (
    <FormItem
      name="confirmNewPassword"
      label={label}
      deps={['password']}
      validators={({ password }) => [
        validators.required('Please input the password again'),
        validators.shouldBeEqual(password, 'Confirm password is not equal to the above password')
      ]}
    >
      <PasswordInput large={large} visible={visible} autoComplete={autoComplete} />
    </FormItem>
  );

  return {
    ...components,
    Email,
    Username,
    Password,
    ConfirmPassword
  };
}

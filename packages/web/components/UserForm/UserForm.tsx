import React from 'react';
import { createForm, FormProps, FormItemProps, validators } from '@/utils/form';
import { IRegister, ILogin, IUpdateProfile, IModifyPassword } from '@/typings';
import { Input, InputProps, Password as PasswordInput } from '../Input';

type UserFormSchema = IRegister & ILogin & IUpdateProfile & IModifyPassword & { confirmNewPassword: string };

export type UserFormProps = FormProps<UserFormSchema>;
export type UserFormInstance = NonNullable<FormProps<UserFormSchema>['form']>;
export type UserFormItemProps = FormItemProps<UserFormSchema> & {
  large?: boolean;
};

type PasswordFormItemProps = UserFormItemProps & {
  visible?: boolean;
  autoComplete?: InputProps['autoComplete'];
};

export const userValidators = {
  username: validators.username,
  password: validators.password
};

export function createUserForm({ large = false, ...itemProps }: UserFormItemProps = {}) {
  const components = createForm<UserFormSchema>(itemProps);
  const { FormItem } = components;

  const Username = ({ label = '用戶名稱', ...props }: UserFormItemProps) => (
    <FormItem {...props} name="username" label={label}>
      <Input large={large} autoComplete="username" />
    </FormItem>
  );

  const Password = ({ visible, autoComplete, label = '密碼', ...props }: PasswordFormItemProps = {}) => (
    <FormItem {...props} name="password" label={label}>
      <PasswordInput large={large} visible={visible} autoComplete={autoComplete} />
    </FormItem>
  );

  const Email = ({ label = '電郵', ...props }: UserFormItemProps = {}) => (
    <FormItem
      {...props}
      name="email"
      label={label}
      validators={[validators.required('Please input an email'), validators.emailFormat()]}
    >
      <Input large={large} autoComplete="email" type="email" />
    </FormItem>
  );

  const ConfirmPassword = ({ visible, autoComplete = 'new-password', label = '確認密碼' }: PasswordFormItemProps) => (
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

  const Nickname = ({ label = '暱稱', ...props }: UserFormItemProps = {}) => (
    <FormItem {...props} name="nickname" label={label}>
      <Input large={large} />
    </FormItem>
  );

  return {
    ...components,
    Email,
    Nickname,
    Username,
    Password,
    ConfirmPassword
  };
}

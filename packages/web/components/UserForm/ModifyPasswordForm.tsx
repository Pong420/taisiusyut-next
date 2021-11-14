import React from 'react';
import { Password } from '@/components/Input';
import { validators } from '@/utils/form';
import { createUserForm, userValidators, UserFormProps } from './UserForm';

const { Form, FormItem } = createUserForm();

export function ModifyPasswordForm(props: UserFormProps) {
  return (
    <Form {...props}>
      <FormItem name="password" label="舊密碼" validators={[validators.required('Please input your old password')]}>
        <Password autoFocus />
      </FormItem>

      <FormItem
        name="newPassword"
        label="新密碼"
        deps={['password']}
        validators={({ password }) => {
          return [
            validators.required('Please input new password'),
            userValidators.password.format,
            validators.shouldNotBeEqual(password, 'The new password should not be equal to the old password')
          ];
        }}
      >
        <Password autoComplete="new-password" />
      </FormItem>

      <FormItem
        name="confirmNewPassword"
        label="確認新密碼"
        deps={['newPassword']}
        validators={({ newPassword }) => [
          validators.required('Please input the new password again'),
          validators.shouldBeEqual(newPassword, 'Confirm new password is not equal to the above new password')
        ]}
      >
        <Password autoComplete="new-password" />
      </FormItem>
    </Form>
  );
}

import { customAlphabet } from 'nanoid';

export const randomIntegerInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const randomOption = <T>(options: T[]) => options[randomIntegerInRange(0, options.length - 1)];

export const rid = (N = 5) => {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return customAlphabet(s, N)();
};

export const randomString = (N = 5) => {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return customAlphabet(s, N)();
};

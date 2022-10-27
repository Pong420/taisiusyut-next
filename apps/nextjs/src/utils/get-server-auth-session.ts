// Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs

import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { User } from '@taisiusyut/api/src/context';
import { unstable_getServerSession } from 'next-auth';
import { authOptions as nextAuthOptions } from '../pages/api/auth/[...nextauth]';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: User;
  }
}

// Next API route example - /pages/api/restricted.ts
export const getServerAuthSession = async (ctx: {
  req: CreateNextContextOptions['req'];
  res: CreateNextContextOptions['res'];
}) => {
  return await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions);
};

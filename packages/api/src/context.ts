// src/server/router/context.ts
import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { DefaultSession } from 'next-auth';
import { getServerAuthSession } from '../../../apps/nextjs/src/utils/get-server-auth-session';
import { prisma } from '@taisiusyut/db';

export interface User extends NonNullable<DefaultSession['user']> {
  id: string;
}

export interface Session extends DefaultSession {
  user?: User;
}

type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return await createContextInner({
    session
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;

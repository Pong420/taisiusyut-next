// src/server/router/index.ts
import { t } from '../trpc';

import { postRouter } from './post';
import { authRouter } from './auth';
import { bookRouter } from './book';
import { shelfRouter } from './shelf';

export const appRouter = t.router({
  auth: authRouter,
  book: bookRouter,
  shelf: shelfRouter,
  post: postRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { z } from 'zod';
import { getProvider } from '../provider';
import { t, protectedProcedure } from '../trpc';

const bookInput = z.object({
  provider: z.string(),
  bookId: z.string()
});

export const shelfRouter = t.router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.book.findMany({ where: { users: { some: { id: ctx.session.user.id } } } });
  }),
  add: protectedProcedure.input(bookInput).mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;

    let book = await ctx.prisma.book.findFirst({
      where: input
    });

    const users = {
      connect: [{ id: user.id }]
    };

    if (book) {
      return ctx.prisma.book.update({ where: { id: book.id }, data: { users } });
    }

    const provider = getProvider(input.provider);
    const { chapters, id, ...info } = await provider.getBook(input.bookId);

    return ctx.prisma.book.create({
      data: {
        ...input,
        ...info,
        users
      }
    });
  }),
  remove: protectedProcedure.input(bookInput).mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;

    await ctx.prisma.book.update({
      where: { uid: input },
      data: {
        users: { disconnect: [{ id: user.id }] }
      }
    });
  })
});

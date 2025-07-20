import { createTRPCRouter } from '../init';
import { filesRouter } from '../procedures/files.procedures';
import { messagesRouter } from '../procedures/messages.procedure';
export const appRouter = createTRPCRouter({
  files: filesRouter,
  messages: messagesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
import { createTRPCRouter } from '../init';
import { filesRouter } from '../procedures/files.procedures';
export const appRouter = createTRPCRouter({
  files: filesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
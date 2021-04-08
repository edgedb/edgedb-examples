import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { todoRouter } from './todoRouter';

// create context based of incoming request
// set as optional here so it can also be re-used for `getStaticProps()`
export const createContext = async (opts?: trpcNext.CreateNextContextOptions) =>
  null;
export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export function createRouter() {
  return trpc.router<Context>();
}
const router = createRouter().merge('todos.', todoRouter);

export const appRouter = router;
export type AppRouter = typeof router;

export default trpcNext.createNextApiHandler({
  router,
  createContext,
});

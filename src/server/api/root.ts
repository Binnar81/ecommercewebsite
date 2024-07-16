import { router } from "../trpc";
import { authRouter } from "./routers/auth";
import { categoriesRouter } from "./routers/categories";

export const appRouter = router({
  auth: authRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
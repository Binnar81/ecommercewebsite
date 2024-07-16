import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "./db";
import { verify } from "jsonwebtoken";

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  let user = null;

  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
      user = { userId: decoded.userId };
    } catch (error) {
      // Invalid token
    }
  }

  return { req, res, prisma, user };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
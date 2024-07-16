import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { sendVerificationEmail } from "../../../utils/mailer";

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const authRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;
      const existingUser = await ctx.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }
      const hashedPassword = await hash(password, 10);
      const verificationCode = generateVerificationCode();
      const user = await ctx.prisma.user.create({
        data: { 
          name, 
          email, 
          password: hashedPassword,
          verificationCode,
        },
      });
      
      await sendVerificationEmail(email, verificationCode);
      
      return { userId: user.id };
    }),

  verify: publicProcedure
    .input(z.object({ userId: z.string(), code: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, code } = input;
      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.verificationCode !== code) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid verification code",
        });
      }
      await ctx.prisma.user.update({
        where: { id: userId },
        data: { verified: true, verificationCode: null },
      });
      return { success: true };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const user = await ctx.prisma.user.findUnique({ where: { email } });
      if (!user || !user.verified) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found or not verified",
        });
      }
      const isValid = await compare(password, user.password);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }
      const token = sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
      ctx.res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=86400`);
      return { userId: user.id };
    }),

    getUser: protectedProcedure.query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.userId },
        select: { id: true, name: true, email: true },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return user;
    }),
  
    logout: protectedProcedure.mutation(({ ctx }) => {
      ctx.res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0");
      return { success: true };
    }),
});
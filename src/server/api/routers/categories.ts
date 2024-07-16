import { z } from "zod";
import { router, protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { faker } from '@faker-js/faker';

export const categoriesRouter = router({
  getCategories: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(6),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit } = input;
      const skip = (page - 1) * limit;

      // Check if the database is empty
      const count = await ctx.prisma.category.count();
      
      if (count === 0) {
        // If empty, seed with faker data
        const categories = Array.from({ length: 100 }, () => ({
          name: faker.commerce.department(),
        }));

        await ctx.prisma.category.createMany({
          data: categories,
          skipDuplicates: true,
        });

        console.log(`Seeded ${categories.length} categories`);
      }

      const [categories, totalCount] = await Promise.all([
        ctx.prisma.category.findMany({
          take: limit,
          skip: skip,
          orderBy: { name: "asc" },
        }),
        ctx.prisma.category.count(),
      ]);

      if (categories.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No categories found",
        });
      }

      return {
        categories,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    }),


    getUserInterests: protectedProcedure.query(async ({ ctx }) => {
      const userInterests = await ctx.prisma.interest.findMany({
        where: { userId: ctx.user.userId },
        include: { category: true },
      });
      return userInterests;
    }),
  
    updateUserInterests: protectedProcedure
      .input(z.object({ categoryIds: z.array(z.string()) }))
      .mutation(async ({ input, ctx }) => {
        const { categoryIds } = input;
  
        // Remove existing interests
        await ctx.prisma.interest.deleteMany({
          where: { userId: ctx.user.userId },
        });
  
        // Add new interests
        await ctx.prisma.interest.createMany({
          data: categoryIds.map(categoryId => ({
            userId: ctx.user.userId,
            categoryId,
          })),
        });
  
        return { success: true };
      }),
});
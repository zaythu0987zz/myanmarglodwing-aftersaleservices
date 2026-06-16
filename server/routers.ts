import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createServiceRecord,
  getServiceRecordsByUserId,
  getServiceRecordById,
  updateServiceRecord,
  deleteServiceRecord,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  serviceRecords: router({
    create: protectedProcedure
      .input(
        z.object({
          date: z.string(),
          brand: z.string(),
          model: z.string(),
          serialNo: z.string(),
          useInPlace: z.string().optional(),
          purchaseLocation: z.string(),
          customerName: z.string(),
          phone: z.string(),
          address: z.string().optional(),
          inTime: z.string().optional(),
          outTime: z.string().optional(),
          coffeeChecked: z.number().default(0),
          waterChecked: z.number().default(0),
          descalingChecked: z.number().default(0),
          milkCleanChecked: z.number().default(0),
          technicalIssues: z.string().optional(),
          repairedBy: z.string().optional(),
          serviceCharges: z.number().default(0),
          partsJson: z.string().optional(),
          totalAmount: z.number().default(0),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Unauthorized");
        return await createServiceRecord({
          userId: ctx.user.id,
          ...input,
        });
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      return await getServiceRecordsByUserId(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Unauthorized");
        const record = await getServiceRecordById(input.id);
        if (record && record.userId !== ctx.user.id) {
          throw new Error("Forbidden");
        }
        return record;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.object({
            date: z.string().optional(),
            brand: z.string().optional(),
            model: z.string().optional(),
            serialNo: z.string().optional(),
            useInPlace: z.string().optional(),
            purchaseLocation: z.string().optional(),
            customerName: z.string().optional(),
            phone: z.string().optional(),
            address: z.string().optional(),
            inTime: z.string().optional(),
            outTime: z.string().optional(),
            coffeeChecked: z.number().optional(),
            waterChecked: z.number().optional(),
            descalingChecked: z.number().optional(),
            milkCleanChecked: z.number().optional(),
            technicalIssues: z.string().optional(),
            repairedBy: z.string().optional(),
            serviceCharges: z.number().optional(),
            partsJson: z.string().optional(),
            totalAmount: z.number().optional(),
          }),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Unauthorized");
        const record = await getServiceRecordById(input.id);
        if (!record || record.userId !== ctx.user.id) {
          throw new Error("Forbidden");
        }
        return await updateServiceRecord(input.id, input.data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Unauthorized");
        const record = await getServiceRecordById(input.id);
        if (!record || record.userId !== ctx.user.id) {
          throw new Error("Forbidden");
        }
        return await deleteServiceRecord(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;

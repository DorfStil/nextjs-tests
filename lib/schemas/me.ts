import { z } from "zod";

export const MeUserSchema = z.object({
  _id: z.string(),
  email: z.string(),
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  __v: z.number(),
});

export const MeResponseSchema = z.object({
  authenticated: z.literal(true),
  user: MeUserSchema,
});

export const MeUnauthorizedResponseSchema = z.object({
  authenticated: z.literal(false),
});

export const AnyMeResponseSchema = z.union([
  MeResponseSchema,
  MeUnauthorizedResponseSchema,
]);

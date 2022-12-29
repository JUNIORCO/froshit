// @ts-nocheck
import { z } from '../_utils/zod.ts';

export const UniversityPayloadSchema = z.object({
  name: z.string(),
  subdomain: z.string(),
  imageUrl: z.string(),
  color: z.string(),
  stripeConnectedAccountId: z.string(),
});

export const FroshPayloadSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
});

export const AdminPayloadSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().nullable(),
});

export const OnboardUniversitySchema = z.object({
  university: UniversityPayloadSchema,
  froshs: FroshPayloadSchema.array(),
  admin: AdminPayloadSchema,
});

export type UniversityPayload = z.infer<typeof UniversityPayloadSchema>;
export type FroshPayload = z.infer<typeof FroshPayloadSchema>;
export type AdminPayload = z.infer<typeof AdminPayloadSchema>;
export type OnboardPayload = z.infer<typeof OnboardUniversitySchema>;

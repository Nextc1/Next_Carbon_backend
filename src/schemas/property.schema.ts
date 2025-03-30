import { z } from "zod";

export const propertyCreateSchema = z.object({
  name: z.string(),
  status: z.enum(["launchpad", "trading"]),
  price: z.number(),
  availableShares: z.number(),
  location: z.string(),
  type: z.string(),
  image: z.string(),
  attributes: z
    .object({
      sharePerNFT: z.number(),
      propertyType: z.string(),
      initialSharePrice: z.number(),
      initialPropertyValue: z.number(),
    })
    .optional(),
  valueParameters: z.any().array().optional(),
  updates: z.any().array().optional(),
  growth: z.string(),
  description: z.string(),
});

export const deletePropertySchema = z.object({
  id: z.string(),
});

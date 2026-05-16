import { z } from "zod";

export const FacilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  amenity: z.string(),
  specialization: z.string(),
  address: z.string(),
  phone: z.string(),
  website: z.string(),
  distance: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export type Facility = z.infer<typeof FacilitySchema>;

export const OverpassElementSchema = z.object({
  type: z.string(),
  id: z.number(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  center: z.object({
    lat: z.number(),
    lon: z.number(),
  }).optional(),
  tags: z.record(z.string()).optional(),
});

export const OverpassResponseSchema = z.object({
  elements: z.array(OverpassElementSchema),
});

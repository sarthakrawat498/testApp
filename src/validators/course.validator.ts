import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  pathwayId: z.number().int().positive()
});

export const updateCourseSchema = createCourseSchema.partial();
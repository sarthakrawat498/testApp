import { z } from 'zod';

export const createPathwaySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
});

export const updatePathwaySchema = createPathwaySchema.partial();
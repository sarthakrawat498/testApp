import { z } from 'zod';

export const createLearningLinkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().refine((value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, 'Must be a valid URL'),
  courseId: z.number().int().positive()
});

export const updateLearningLinkSchema = createLearningLinkSchema.partial();
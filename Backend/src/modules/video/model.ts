import { z } from 'zod';

export const createVideoSchema = z.object({
  title: z.string(),
  prompt: z.string(),
  avatarId: z.string().optional(),
  imageUrl: z.string().optional(), // optional reference image URL (e.g. from avatar generatedImagePath)
  videoUrl: z.string().optional(),
});

export type CreateVideoType = z.infer<typeof createVideoSchema>;

import { z } from 'zod';

export const createAvatarSchema = z.object({
  name: z.string(),
  images: z.array(z.string()).optional(),
  prompt: z.string().optional(), // Optional text prompt for Gemini text generation
});

export const CreateAvatarSchenma = createAvatarSchema;

export type CreateAvatarType = z.infer<typeof createAvatarSchema>;

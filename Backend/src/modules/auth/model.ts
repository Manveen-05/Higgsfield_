import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters")
});

export type SignupType = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters")
});

export type SigninType = z.infer<typeof signinSchema>;


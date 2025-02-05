import { z } from "zod";

export const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  mobileNumber: z.string(),
  education: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// export const resourceSchema = z.object({
//   type: z.string(),
//   tags: z.array(z.string()),
//   title: z.string(),
//   url: z.string(),
//   description: z.string(),
//   difficulty: z.string(),
//   rating: z.number(),
//   reviews: z.array(z.string()),
// });

// export const bookmarkSchema = z.object({
//   resource: z.string(),
// });

// export const resourceCompletedSchema = z.object({
//   resource: z.string(),
//   user: z.string(),
// });

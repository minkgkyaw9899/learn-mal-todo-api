import z from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required!" })
      .min(3, "Name must be at last 3 characters!"),
    email: z.email({ error: "Email is required!" }),
    password: z
      .string({ error: "Password is required!" })
      .min(6, "Password must be at last 6 characters!"),
  }),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>["body"];

export const updateUserSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required!" })
      .min(3, "Name must be at last 3 characters!")
      .optional(),
    email: z.email({ error: "Email is required!" }).optional(),
    password: z
      .string({ error: "Password is required!" })
      .min(6, "Password must be at last 6 characters!")
      .optional(),
  }),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>["body"];

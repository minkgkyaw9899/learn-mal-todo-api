import z from "zod";

export const signInSchema = z.object({
  body: z.object({
    email: z.email({ error: "Email is required!" }),
    password: z
      .string({ error: "Password is required!" })
      .min(6, "Password must be at last 6 characters!"),
  }),
});

export type SignInSchema = z.infer<typeof signInSchema>["body"];

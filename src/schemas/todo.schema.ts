import z from "zod";

export const createTodoSchema = z.object({
  body: z.object({
    title: z
      .string({ error: "Title is required!" })
      .min(3, "Title must be at last 3 characters!"),
    isCompleted: z
      .boolean({ error: "IsCompleted must be boolean" })
      .optional()
      .default(false),
  }),
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>["body"];

export const updateTodoSchema = z.object({
  body: z.object({
    title: z
      .string({ error: "Title is required!" })
      .min(3, "Title must be at last 3 characters!")
      .optional(),
    isCompleted: z.boolean({ error: "IsCompleted must be boolean" }).optional(),
  }),
});

export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>["body"];

import z from "zod";

export const idParamSchema = z.object({
  params: z.object({
    id: z
      .string({ error: "Id is required and must be number" })
      .pipe(z.coerce.number({ error: "Id must be number" })),
  }),
});

export type IdParamSchema = { id: string };

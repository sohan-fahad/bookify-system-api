import z from "zod";

export const bookQuerySchema = z.object({
    page: z.string(),
    limit: z.string(),
    search: z.string().optional(),
    sort: z.enum(["asc", "desc"]).default("desc"),
});

export type BookQuerySchemaType = z.infer<typeof bookQuerySchema>;
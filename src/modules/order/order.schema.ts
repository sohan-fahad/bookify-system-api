import z from "zod";

export const orderItemSchema = z.object({
    bookId: z.string(),
    quantity: z.number(),
});

export const createOrderSchema = z.object({
    customerId: z.string(),
    items: z.array(orderItemSchema),
});

export const orderQuerySchema = z.object({
    customerId: z.string().optional(),
    page: z.string(),
    limit: z.string(),
    sort: z.enum(["asc", "desc"]).optional().default("desc")
});

export type CreateOrderSchemaType = z.infer<typeof createOrderSchema>;
export type OrderItemSchemaType = z.infer<typeof orderItemSchema>;
export type OrderQuerySchemaType = z.infer<typeof orderQuerySchema>;
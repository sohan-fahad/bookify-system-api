import z from "zod";
import { ReferralStatus } from "./referral.model";

export const referralQuerySchema = z.object({
    referrerUserId: z.string().optional(),
    referredUserId: z.string().optional(),
    status: z.enum(ReferralStatus).optional(),
    page: z.string(),
    limit: z.string(),
    sort: z.enum(["asc", "desc"]).optional(),
});

export type ReferralQuerySchemaType = z.infer<typeof referralQuerySchema>;
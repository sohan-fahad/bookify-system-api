import { ITokenResponsePayload } from "../../utils/jwt.utils.js";
import responseUtils from "../../utils/response.utils.js";
import userService from "../user/user.service.js";
import { ReferralQuerySchemaType } from "./referral.schema.js";
import referralService from "./referral.service.js";
import { Request, Response } from "express"

const getAllReferralHandler = async (req: Request, res: Response) => {
    try {

        let query: ReferralQuerySchemaType = req.query as unknown as ReferralQuerySchemaType;

        const { data, meta } = await referralService.getAll(query);

        return responseUtils.successResponse(res, {
            data: data,
            meta: meta,
            message: "Referral fetched successfully",
            statusCode: 200,

        });
    } catch (error: any) {
        return responseUtils.errorResponse(res, {
            message: error.message,
            statusCode: 500,
        });
    }
}

const getMyReferralsHandler = async (req: Request, res: Response) => {
    try {

        let query: ReferralQuerySchemaType = req.query as unknown as ReferralQuerySchemaType;

        const { id } = req.user as ITokenResponsePayload['user'];
        const user = await userService.findById(id);
        if (!user) {
            return responseUtils.errorResponse(res, {
                message: "User not found",
                statusCode: 404,
            });
        }
        query.referrerUserId = id;

        const { data, meta } = await referralService.getAll(query);

        return responseUtils.successResponse(res, {
            data: data,
            meta: meta,
            message: "Referral fetched successfully",
            statusCode: 200,

        });
    } catch (error: any) {
        return responseUtils.errorResponse(res, {
            message: error.message,
            statusCode: 500,
        });
    }
}

const getStatsHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.user as ITokenResponsePayload['user'];

        const user = await userService.findById(id);
        if (!user) {
            return responseUtils.errorResponse(res, {
                message: "User not found",
                statusCode: 404,
            });
        }

        const stats = await referralService.getStats(id);
        return responseUtils.successResponse(res, {
            data: stats,
            message: "Stats fetched successfully",
            statusCode: 200,
        });
    }
    catch (error: any) {
        return responseUtils.errorResponse(res, {
            message: error.message,
            statusCode: 500,
        });
    }
}

export default {
    getAllReferralHandler,
    getMyReferralsHandler,
    getStatsHandler,
}
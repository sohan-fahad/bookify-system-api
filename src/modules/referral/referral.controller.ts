import responseUtils from "../../utils/response.utils";
import { ReferralQuerySchemaType } from "./referral.schema";
import referralService from "./referral.service";
import { Request, Response, NextFunction } from "express"

const getAllReferralHandler = async (req: Request, res: Response) => {
    try {
        const { data, ...rest } = await referralService.getAll(req.query as unknown as ReferralQuerySchemaType);
        return responseUtils.successResponse(res, {
            data: data,
            meta: rest.meta,
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

const getMetricsHandler = async (req: Request, res: Response) => {
    try {
        const metrics = await referralService.getMetrics();
        return responseUtils.successResponse(res, {
            data: metrics,
            message: "Metrics fetched successfully",
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
    getMetricsHandler,
}
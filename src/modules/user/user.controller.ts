import { Request, Response } from "express";
import userService from "./user.service";
import responseUtils from "../../utils/response.utils";
import { ITokenResponsePayload } from "../../utils/jwt.utils";

const getMyProfileHandler = async (req: Request, res: Response) => {
    const { id } = req.user as ITokenResponsePayload['user'];
    const user = await userService.findById(id);

    if (!user) {
        return responseUtils.errorResponse(res, {
            message: "Profile not found",
            statusCode: 404,
        });
    }

    return responseUtils.successResponse(res, {
        message: "Profile fetched successfully",
        data: user,
        statusCode: 200,
    });
};

export default {
    getMyProfileHandler,
};
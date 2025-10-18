import { NextFunction, Request, Response } from "express";
import responseUtils from "../utils/response.utils";
import jwtUtils from "../utils/jwt.utils";

export default async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return responseUtils.errorResponse(res, {
            message: "Unauthorized",
            statusCode: 401,
        });
    }

    try {

        const isExpiredToken = jwtUtils.isExpiredToken(token);

        console.log("isExpiredToken from auth middleware: ", isExpiredToken);

        if (isExpiredToken) {
            return responseUtils.errorResponse(res, {
                message: "Unauthorized",
                statusCode: 401,
            });
        }

        const decoded = jwtUtils.extractTokenFromHeader(token);

        console.log("decoded from auth middleware: ", decoded);

        req.user = decoded?.user;

        next();
    } catch (error) {
        return responseUtils.errorResponse(res, {
            message: "Unauthorized",
            statusCode: 401,
        });
    }


};
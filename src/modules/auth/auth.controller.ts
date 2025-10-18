import { Request, Response } from "express"
import { LoginSchemaType } from "./auth.schema.js"
import responseUtils from "../../utils/response.utils.js"
import bcryptUtils from "../../utils/bcrypt.utils.js"
import userService from "../user/user.service.js"
import jwtUtils from "../../utils/jwt.utils.js"

const registerHandler = async (
    req: Request,
    res: Response,
) => {
    try {

        const user = await userService.findUserByEmail(req.body.email);

        if (user) {
            return responseUtils.errorResponse(res, {
                message: "User already exists",
                statusCode: 409
            })
        }

        const newUser = await userService.createUser(req.body);

        const token = jwtUtils.makeAccessToken({ user: { id: newUser._id, role: newUser.role } });
        const refreshToken = jwtUtils.makeRefreshToken({ user: { id: newUser._id, role: newUser.role } });

        return responseUtils.successResponse(res, {
            data: { user: newUser, token, refreshToken },
            message: "User registered successfully",
            statusCode: 201
        })
    } catch (error: any) {
        return responseUtils.errorResponse(res, {
            message: error.message || "Registration failed",
            statusCode: 500
        })
    }
}

const loginHandler = async (
    req: Request,
    res: Response,
) => {
    try {
        const { email, password } = req.body as LoginSchemaType

        const userExists = await userService.findUserByEmail(email);

        if (!userExists) {
            return responseUtils.errorResponse(res, {
                message: "User not found",
                statusCode: 404
            })
        }

        const isPasswordValid = await bcryptUtils.comparePassword(password, userExists.password);

        if (!isPasswordValid) {
            return responseUtils.errorResponse(res, {
                message: "Invalid password",
                statusCode: 401
            })
        }

        const token = jwtUtils.makeAccessToken({ user: { id: userExists._id, role: userExists.role } });

        const refreshToken = jwtUtils.makeRefreshToken({ user: { id: userExists._id, role: userExists.role } });

        return responseUtils.successResponse(res, {
            data: { user: userExists, token, refreshToken },
            message: "User logged in successfully",
            statusCode: 200
        })
    } catch (error: any) {
        return responseUtils.errorResponse(res, {
            message: error.message || "Login failed",
            statusCode: 401
        })
    }
}

export default {
    registerHandler,
    loginHandler
}
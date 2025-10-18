import { Response } from "express"

const successResponse = (res: Response, data: { data: any, message: string, statusCode?: number, meta?: { page: number, limit: number, total: number } }) => {
    return res.status(data.statusCode ? data.statusCode : 200).json({
        success: true,
        message: data.message,
        data: data.data,
        ...(data.meta && { meta: data.meta }),
    });
};

const errorResponse = (res: Response, data: { message: string, statusCode?: number }) => {
    return res.status(data.statusCode ? data.statusCode : 500).json({
        success: false,
        message: data.message,
    });
};

export default {
    successResponse,
    errorResponse,
};
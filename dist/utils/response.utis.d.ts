import { Response } from "express";
export declare const successResponse: (res: Response, data: {
    data: any;
    message: string;
    statusCode?: number;
}) => Response<any, Record<string, any>>;
export declare const errorResponse: (res: Response, data: {
    message: string;
    statusCode?: number;
}) => Response<any, Record<string, any>>;

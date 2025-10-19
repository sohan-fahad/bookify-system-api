import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import responseUtils from "../utils/response.utils.js";


const validateBodyMiddleware =
  (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log(req.body);
        schema.parse(req.body);
        next();
      } catch (e: any) {


        const errors = JSON.parse(e?.message)?.map((err: any) => ({
          message: err.message,
        }));

        return responseUtils.errorResponse(res, {
          message: errors[0]?.message || "Validation error",
          statusCode: 400
        });
      }
    }

const validateParamsMiddleware =
  (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.params);
        next();
      } catch (e: any) {
        const errors = JSON.parse(e?.message)?.map((err: any) => ({
          message: err.message,
        }));

        return responseUtils.errorResponse(res, {
          message: errors[0]?.message || "Validation error",
          statusCode: 400
        });
      }
    }

const validateQueryMiddleware =
  (schema: ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.query);
        next();
      } catch (e: any) {


        const errors = JSON.parse(e?.message)?.map((err: any) => ({
          message: err.message,
        }));

        return responseUtils.errorResponse(res, {
          message: errors[0]?.message || "Validation error",
          statusCode: 400
        });
      }
    }

export default {
  validateBodyMiddleware,
  validateParamsMiddleware,
  validateQueryMiddleware,
};
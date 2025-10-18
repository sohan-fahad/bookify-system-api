import { OrderQuerySchemaType, CreateOrderSchemaType } from "./order.schema";
import orderService from "./order.service";
import { Request, Response } from "express";
import responseUtils from "../../utils/response.utils";

const createOrderHandler = async (req: Request, res: Response) => {
    try {
        const body = req.body as CreateOrderSchemaType;
        const { id } = req.user as ITokenResponsePayload['user'];
        body.customerId = id;
        const order = await orderService.createOrder(body);
        return responseUtils.successResponse(res, {
            message: "Order created successfully",
            data: order,
            statusCode: 201,
        });
    } catch (error) {
        return responseUtils.errorResponse(res, {
            message: "Internal server error",
            statusCode: 500,
        });
    }
};

const getOrdersHandler = async (req: Request, res: Response) => {
    const query = req.query as OrderQuerySchemaType;

    const { data, meta } = await orderService.getOrders(query);

    return responseUtils.successResponse(res, {
        message: "Orders fetched successfully",
        data,
        meta,
        statusCode: 200,
    });
};

const getOrderByIdHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await orderService.getOrderById(id);

        if (!order) {
            return responseUtils.errorResponse(res, {
                message: "Order not found",
                statusCode: 404,
            });
        }
        return responseUtils.successResponse(res, {
            message: "Order fetched successfully",
            data: order,
            statusCode: 200,
        });
    } catch (error: any) {
        return responseUtils.errorResponse(res, {
            message: error?.message || "Internal server error",
            statusCode: 500,
        });
    }
};

const getMyOrdersHandler = async (req: Request, res: Response) => {

    const query = req.query as OrderQuerySchemaType;

    const { id } = req.user as ITokenResponsePayload['user'];

    query.customerId = id;

    const { data, meta } = await orderService.getOrders(query);

    return responseUtils.successResponse(res, {
        message: "My orders fetched successfully",
        data,
        meta,
        statusCode: 200,
    });
};

export default {
    createOrderHandler,
    getOrdersHandler,
    getOrderByIdHandler,
    getMyOrdersHandler,
};
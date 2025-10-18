import { BookQuerySchemaType } from "./book.schema";
import { Request, Response } from "express";
import bookService from "./book.service";
import responseUtils from "../../utils/response.utils";

const getBooksHandler = async (req: Request, res: Response) => {
    try {

        const query = req.query as BookQuerySchemaType;

        const books = await bookService.getBooks(query);

        return responseUtils.successResponse(res, {
            data: books.data,
            meta: books.meta,
            message: "Books fetched successfully",
            statusCode: 200,
        });
    } catch (error: any) {
        return responseUtils.errorResponse(res, {
            message: error.message,
            statusCode: 500,
        });
    }
}

export default {
    getBooksHandler,
}
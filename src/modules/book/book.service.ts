import Book from "./book.model.js";
import { BookQuerySchemaType } from "./book.schema.js";

const getBooks = async (query: BookQuerySchemaType) => {
    const { limit, search, page, sort } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const sortBy = sort === "asc" ? 1 : -1;

    const queryObject: any = {};

    if (search) {
        queryObject.$or = [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
            { year: { $regex: search, $options: "i" } },
            { language: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
        ];
    }


    const books = await Book.find(queryObject)
        .limit(Number(limit))
        .skip(Number(skip))
        .sort({ createdAt: sortBy })
        .select("-__v")
        .lean();
    const total = await Book.countDocuments(queryObject);

    return {
        data: books,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
        }
    };
}

const validateBulkBookIds = async (bookIds: string[]) => {
    const books = await Book.find({ _id: { $in: bookIds } }).select("-__v");
    return books;
}

export default {
    getBooks,
    validateBulkBookIds,
}
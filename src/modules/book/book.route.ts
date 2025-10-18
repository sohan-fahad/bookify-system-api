import express, { Router } from "express"
import bookController from "./book.controller";
import validatorMiddleware from "../../middlewares/validator.middleware";
import { bookQuerySchema } from "./book.schema";

const bookRoutes: Router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Book unique identifier
 *           example: 507f1f77bcf86cd799439011
 *         id:
 *           type: string
 *           description: Book ID
 *           example: book-123
 *         title:
 *           type: string
 *           description: Book title
 *           example: The Great Gatsby
 *         author:
 *           type: string
 *           description: Book author
 *           example: F. Scott Fitzgerald
 *         year:
 *           type: integer
 *           description: Publication year
 *           example: 1925
 *         pages:
 *           type: integer
 *           description: Number of pages
 *           example: 180
 *         language:
 *           type: string
 *           description: Book language
 *           example: English
 *         country:
 *           type: string
 *           description: Country of origin
 *           example: USA
 *         imageLink:
 *           type: string
 *           format: uri
 *           description: Link to book cover image
 *           example: https://example.com/gatsby.jpg
 *         link:
 *           type: string
 *           format: uri
 *           description: Link to book details
 *           example: https://example.com/books/gatsby
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     PaginatedBooksResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Books fetched successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: Total number of books matching the query
 *               example: 100
 *             page:
 *               type: integer
 *               description: Current page number
 *               example: 1
 *             limit:
 *               type: integer
 *               description: Number of items per page
 *               example: 10
 */

/**
 * @openapi
 * /api/v1/books:
 *   get:
 *     summary: Get books with pagination and search
 *     description: Retrieve a paginated list of books with optional search functionality
 *     tags:
 *       - Book
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: string
 *         description: Page number for pagination
 *         example: "1"
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: string
 *         description: Number of items per page
 *         example: "10"
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order by creation date
 *         example: desc
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term to filter books by title, author, or other fields
 *         example: gatsby
 *     responses:
 *       200:
 *         description: Books fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedBooksResponse'
 *             example:
 *               success: true
 *               message: Books fetched successfully
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   id: book-1
 *                   title: The Great Gatsby
 *                   author: F. Scott Fitzgerald
 *                   year: 1925
 *                   pages: 180
 *                   language: English
 *                   country: USA
 *                   imageLink: https://example.com/gatsby.jpg
 *                   link: https://example.com/books/gatsby
 *                   createdAt: 2025-10-18T10:00:00.000Z
 *                   updatedAt: 2025-10-18T10:00:00.000Z
 *                 - _id: 507f1f77bcf86cd799439012
 *                   id: book-2
 *                   title: To Kill a Mockingbird
 *                   author: Harper Lee
 *                   year: 1960
 *                   pages: 324
 *                   price: 100
 *                   language: English
 *                   country: USA
 *                   imageLink: https://example.com/mockingbird.jpg
 *                   link: https://example.com/books/mockingbird
 *                   createdAt: 2025-10-18T11:00:00.000Z
 *                   updatedAt: 2025-10-18T11:00:00.000Z
 *               meta:
 *                 total: 100
 *                 page: 1
 *                 limit: 10
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Validation error - page is required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Internal server error
 */
bookRoutes.get("/", validatorMiddleware.validateQueryMiddleware(bookQuerySchema), bookController.getBooksHandler);

export default bookRoutes;
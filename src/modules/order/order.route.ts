import express, { Router } from "express"
import orderController from "./order.controller.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import { createOrderSchema } from "./order.schema.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const orderRoutes: Router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - bookId
 *         - quantity
 *       properties:
 *         bookId:
 *           type: string
 *           description: Book ID (MongoDB ObjectId)
 *           example: 507f1f77bcf86cd799439011
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity of books to order
 *           example: 2
 *         price:
 *           type: number
 *           minimum: 0.01
 *           description: Price per unit (auto-calculated)
 *           example: 29.99
 *     
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - customerId
 *         - items
 *       properties:
 *         customerId:
 *           type: string
 *           description: Customer ID (MongoDB ObjectId)
 *           example: 507f1f77bcf86cd799439012
 *         items:
 *           type: array
 *           minItems: 1
 *           description: List of books to order
 *           items:
 *             type: object
 *             required:
 *               - bookId
 *               - quantity
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Order unique identifier
 *           example: 507f1f77bcf86cd799439013
 *         customerId:
 *           type: string
 *           description: Customer ID
 *           example: 507f1f77bcf86cd799439012
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalAmount:
 *           type: number
 *           description: Total order amount
 *           example: 59.98
 *         totalCreditsEarned:
 *           type: number
 *           description: Credits earned from this order
 *           example: 2
 *         isFirstPurchase:
 *           type: boolean
 *           description: Whether this is customer's first purchase
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     OrderResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Order created successfully
 *         data:
 *           $ref: '#/components/schemas/Order'
 *     
 *     PaginatedOrdersResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Orders fetched successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 50
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 */

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order with one or more books. Automatically calculates total amount and awards credits for first purchase.
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *           examples:
 *             singleBook:
 *               summary: Order with single book
 *               value:
 *                 customerId: 507f1f77bcf86cd799439012
 *                 items:
 *                   - bookId: 507f1f77bcf86cd799439011
 *                     quantity: 1
 *             multipleBooks:
 *               summary: Order with multiple books
 *               value:
 *                 customerId: 507f1f77bcf86cd799439012
 *                 items:
 *                   - bookId: 507f1f77bcf86cd799439011
 *                     quantity: 2
 *                   - bookId: 507f1f77bcf86cd799439014
 *                     quantity: 1
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *             example:
 *               success: true
 *               message: Order created successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439013
 *                 customerId: 507f1f77bcf86cd799439012
 *                 items:
 *                   - bookId: 507f1f77bcf86cd799439011
 *                     quantity: 2
 *                     price: 29.99
 *                 totalAmount: 59.98
 *                 totalCreditsEarned: 2
 *                 isFirstPurchase: true
 *                 createdAt: 2025-10-18T10:00:00.000Z
 *                 updatedAt: 2025-10-18T10:00:00.000Z
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Validation error - items is required
 *       404:
 *         description: Customer or book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Customer not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
orderRoutes.post("/", validatorMiddleware.validateBodyMiddleware(createOrderSchema), orderController.createOrderHandler);

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a paginated list of orders with optional filtering by customer ID
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
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
 *         name: customerId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by customer ID (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439012
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order by creation date
 *         example: desc
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrdersResponse'
 *             example:
 *               success: true
 *               message: Orders fetched successfully
 *               data:
 *                 - _id: 507f1f77bcf86cd799439013
 *                   customerId: 507f1f77bcf86cd799439012
 *                   items:
 *                     - bookId: 507f1f77bcf86cd799439011
 *                       quantity: 2
 *                       price: 29.99
 *                   totalAmount: 59.98
 *                   totalCreditsEarned: 2
 *                   isFirstPurchase: true
 *                   createdAt: 2025-10-18T10:00:00.000Z
 *                   updatedAt: 2025-10-18T10:00:00.000Z
 *               meta:
 *                 total: 50
 *                 page: 1
 *                 limit: 10
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
orderRoutes.get("/", orderController.getOrdersHandler);

/**
 * @openapi
 * /api/v1/orders/my-orders:
 *   get:
 *     summary: Get my orders
 *     description: Retrieve all orders for the authenticated user with pagination
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: string
 *           default: "1"
 *         description: Page number for pagination
 *         example: "1"
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: string
 *           default: "10"
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
 *     responses:
 *       200:
 *         description: My orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrdersResponse'
 *             example:
 *               success: true
 *               message: My orders fetched successfully
 *               data:
 *                 - _id: 507f1f77bcf86cd799439013
 *                   customerId: 507f1f77bcf86cd799439012
 *                   items:
 *                     - bookId: 507f1f77bcf86cd799439011
 *                       quantity: 2
 *                       price: 29.99
 *                   totalAmount: 59.98
 *                   totalCreditsEarned: 2
 *                   isFirstPurchase: true
 *                   createdAt: 2025-10-18T10:00:00.000Z
 *               meta:
 *                 total: 5
 *                 page: 1
 *                 limit: 10
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
orderRoutes.get("/my-orders", authMiddleware, orderController.getMyOrdersHandler);

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieve a specific order by its unique identifier
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *             example:
 *               success: true
 *               message: Order fetched successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439013
 *                 customerId: 507f1f77bcf86cd799439012
 *                 items:
 *                   - bookId: 507f1f77bcf86cd799439011
 *                     quantity: 2
 *                     price: 29.99
 *                 totalAmount: 59.98
 *                 totalCreditsEarned: 2
 *                 isFirstPurchase: true
 *                 createdAt: 2025-10-18T10:00:00.000Z
 *                 updatedAt: 2025-10-18T10:00:00.000Z
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Order not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
orderRoutes.get("/:id", orderController.getOrderByIdHandler);

export default orderRoutes;
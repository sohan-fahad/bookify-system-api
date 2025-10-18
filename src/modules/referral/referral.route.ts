import express, { Router } from "express"
import { referralQuerySchema } from "./referral.schema";
import validatorMiddleware from "../../middlewares/validator.middleware";
import referralController from "./referral.controller";

const referralRoutes: Router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Referral:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Referral unique identifier
 *           example: 507f1f77bcf86cd799439011
 *         referrerUserId:
 *           type: string
 *           description: ID of the user who referred
 *           example: 507f1f77bcf86cd799439012
 *         referredUserId:
 *           type: string
 *           description: ID of the user who was referred
 *           example: 507f1f77bcf86cd799439013
 *         status:
 *           type: string
 *           enum: [pending, converted]
 *           description: Status of the referral
 *           example: pending
 *         creditsAwarded:
 *           type: number
 *           description: Credits awarded for this referral
 *           example: 0
 *           minimum: 0
 *         convertedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date when the referral was converted
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Referral creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     PaginatedReferralResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Referral fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Referral'
 *             total:
 *               type: number
 *               description: Total number of referrals matching the query
 *               example: 50
 *             page:
 *               type: number
 *               description: Current page number
 *               example: 1
 *             limit:
 *               type: number
 *               description: Number of items per page
 *               example: 10
 *     
 *     MetricsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Metrics fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *               description: Total number of referrals
 *               example: 50
 *             totalConverted:
 *               type: number
 *               description: Total number of converted referrals
 *               example: 10
 *             totalPending:
 *               type: number
 *               description: Total number of pending referrals
 *               example: 40
 */

/**
 * @openapi
 * /api/v1/referrals:
 *   get:
 *     summary: Get all referrals with pagination and filtering
 *     description: Retrieve a paginated list of referrals with optional filters for referrer, referred user, and status
 *     tags:
 *       - Referral
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: referrerUserId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by user who made the referral (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439011
 *       - in: query
 *         name: referredUserId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by user who was referred (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439012
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, converted]
 *         description: Filter by referral status
 *         example: pending
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
 *         description: Referrals fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedReferralResponse'
 *             example:
 *               success: true
 *               message: Referral fetched successfully
 *               data:
 *                 data:
 *                   - _id: 507f1f77bcf86cd799439011
 *                     referrerUserId: 507f1f77bcf86cd799439012
 *                     referredUserId: 507f1f77bcf86cd799439013
 *                     status: pending
 *                     creditsAwarded: 0
 *                     convertedAt: null
 *                     createdAt: 2025-10-18T10:00:00.000Z
 *                     updatedAt: 2025-10-18T10:00:00.000Z
 *                   - _id: 507f1f77bcf86cd799439014
 *                     referrerUserId: 507f1f77bcf86cd799439012
 *                     referredUserId: 507f1f77bcf86cd799439015
 *                     status: converted
 *                     creditsAwarded: 100
 *                     convertedAt: 2025-10-19T15:30:00.000Z
 *                     createdAt: 2025-10-18T12:00:00.000Z
 *                     updatedAt: 2025-10-19T15:30:00.000Z
 *                 total: 50
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
 *               message: Validation error - page must be a number
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

referralRoutes.get(
    "/",
    validatorMiddleware.validateQueryMiddleware(referralQuerySchema),
    referralController.getAllReferralHandler
);


/**
 * @openapi
 * components:
 *   schemas:
 *     Referral:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Referral unique identifier
 *           example: 507f1f77bcf86cd799439011
 *         referrerUserId:
 *           type: string
 *           description: ID of the user who referred
 *           example: 507f1f77bcf86cd799439012
 *         referredUserId:
 *           type: string
 *           description: ID of the user who was referred
 *           example: 507f1f77bcf86cd799439013
 *         status:
 *           type: string
 *           enum: [pending, converted]
 *           description: Status of the referral
 *           example: pending
 *         creditsAwarded:
 *           type: number
 *           description: Credits awarded for this referral
 *           example: 0
 *           minimum: 0
 *         convertedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date when the referral was converted
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Referral creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     PaginatedReferralResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Referral fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Referral'
 *             total:
 *               type: number
 *               description: Total number of referrals matching the query
 *               example: 50
 *             page:
 *               type: number
 *               description: Current page number
 *               example: 1
 *             limit:
 *               type: number
 *               description: Number of items per page
 *               example: 10
 *     
 *     MetricsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Metrics fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *               description: Total number of referrals
 *               example: 50
 *             totalConverted:
 *               type: number
 *               description: Total number of converted referrals
 *               example: 10
 *             totalPending:
 *               type: number
 *               description: Total number of pending referrals
 *               example: 40
 */

/**
 * @openapi
 * /api/v1/referrals/my:
 *   get:
 *     summary: Get my referrals with pagination and filtering
 *     description: Retrieve a paginated list of referrals with optional filters for referrer, referred user, and status
 *     tags:
 *       - Referral
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: referredUserId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by user who was referred (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439012
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, converted]
 *         description: Filter by referral status
 *         example: pending
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
 *         description: Referrals fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedReferralResponse'
 *             example:
 *               success: true
 *               message: Referral fetched successfully
 *               data:
 *                 data:
 *                   - _id: 507f1f77bcf86cd799439011
 *                     referrerUserId: 507f1f77bcf86cd799439012
 *                     referredUserId: 507f1f77bcf86cd799439013
 *                     status: pending
 *                     creditsAwarded: 0
 *                     convertedAt: null
 *                     createdAt: 2025-10-18T10:00:00.000Z
 *                     updatedAt: 2025-10-18T10:00:00.000Z
 *                   - _id: 507f1f77bcf86cd799439014
 *                     referrerUserId: 507f1f77bcf86cd799439012
 *                     referredUserId: 507f1f77bcf86cd799439015
 *                     status: converted
 *                     creditsAwarded: 100
 *                     convertedAt: 2025-10-19T15:30:00.000Z
 *                     createdAt: 2025-10-18T12:00:00.000Z
 *                     updatedAt: 2025-10-19T15:30:00.000Z
 *                 total: 50
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
 *               message: Validation error - page must be a number
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
referralRoutes.get(
    "/my",
    validatorMiddleware.validateQueryMiddleware(referralQuerySchema),
    referralController.getMyReferralsHandler
);

/**
 * @openapi
 * /api/v1/referrals/my/metrics:
 *   get:
 *     summary: Get referral metrics
 *     description: Retrieve aggregated metrics about referrals including total, converted, and pending counts
 *     tags:
 *       - Referral
 *     responses:
 *       200:
 *         description: Metrics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetricsResponse'
 *             example:
 *               success: true
 *               message: Metrics fetched successfully
 *               data:
 *                 total: 50
 *                 totalConverted: 10
 *                 totalPending: 40
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
referralRoutes.get(
    "/my/metrics",
    referralController.getMetricsHandler
);

export default referralRoutes;
import express, { Router } from "express";
import userController from "./user.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const userRoutes: Router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User unique identifier
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           description: User's full name
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: User's role in the system
 *           example: user
 *         referralCode:
 *           type: string
 *           description: User's unique referral code for inviting others
 *           example: JD7X9Q
 *         referredBy:
 *           type: string
 *           nullable: true
 *           description: ID of the user who referred this user
 *           example: 507f1f77bcf86cd799439012
 *         credits:
 *           type: number
 *           description: User's accumulated credit balance
 *           example: 10
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *           example: 2025-10-18T10:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: 2025-10-18T10:00:00.000Z
 *     
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Profile fetched successfully
 *         data:
 *           $ref: '#/components/schemas/UserProfile'
 */

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     summary: Get my profile
 *     description: Retrieve the profile information of the currently authenticated user including referral code, credits, and account details
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *             example:
 *               success: true
 *               message: Profile fetched successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 name: John Doe
 *                 email: john.doe@example.com
 *                 role: user
 *                 referralCode: JD7X9Q
 *                 referredBy: 507f1f77bcf86cd799439012
 *                 credits: 10
 *                 createdAt: 2025-10-18T10:00:00.000Z
 *                 updatedAt: 2025-10-18T10:00:00.000Z
 *       401:
 *         description: Unauthorized - Authentication token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Profile not found
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
userRoutes.get("/me", authMiddleware, userController.getMyProfileHandler);

export default userRoutes;
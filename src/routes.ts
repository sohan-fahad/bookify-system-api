import express, { Router } from "express"
import referralRoutes from "./modules/referral/referral.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import bookRoutes from "./modules/book/book.route.js";
import orderRoutes from "./modules/order/order.route.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import userRoutes from "./modules/user/user.route.js";

const routes: Router = express.Router();

routes.use("/v1/auth", authRoutes);
routes.use("/v1/books", bookRoutes);
routes.use("/v1/referrals", authMiddleware, referralRoutes);
routes.use("/v1/orders", authMiddleware, orderRoutes);
routes.use("/v1/users", authMiddleware, userRoutes);

export default routes;
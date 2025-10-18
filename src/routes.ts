import express, { Router } from "express"
import referralRoutes from "./modules/referral/referral.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import bookRoutes from "./modules/book/book.route.js";

const routes: Router = express.Router();

routes.use("/v1/referral", referralRoutes);
routes.use("/v1/auth", authRoutes);
routes.use("/v1/book", bookRoutes);

export default routes;
import express, { Router } from "express"
import { registerHandler } from "../controllers/auth.controller"
import validateRequestMiddleware from "../middlewares/validator.middleware"

const router: Router = express.Router()

router.post("/register", validateRequestMiddleware(registerSchema), registerHandler)

// router.post("/login", validateRequestMiddleware(registerSchema), registerHandler)

export default router
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import mongoose from "mongoose";
import { swaggerSpec } from "./configs/swagger.config.js";
import { connectDB } from "./configs/db.config.js";
import responseUtils from "./utils/response.utils.js";
import routes from "./routes.js";
import dotenv from "dotenv";
import seedBooks from "./scripts/seed.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/", (_req, res) => {
    responseUtils.successResponse(res, { data: process.env, message: "Referral System API is running" });
});

app.get("/health", (_req, res) => {
    const dbConnected = mongoose.connection.readyState === 1;
    responseUtils.successResponse(res, { data: { dbConnected }, message: "Health check", statusCode: 200 });
});

// Routes
app.use("/api", routes);


connectDB().catch((err) => {
    console.error("MongoDB connection error:", err);
}).then(() => {
    console.log("MongoDB connected successfully");
    seedBooks();
});


const PORT = Number(process.env.PORT);

app.listen(PORT, () => {
    console.log(`Referral System API is running on port ${PORT}`);
});


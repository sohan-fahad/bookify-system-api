import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import mongoose from "mongoose";
import { swaggerSpec } from "./configs/swagger.config.js";
import ENV from "./ENV.js";
import { connectDB } from "./configs/db.config.js";
import responseUtils from "./utils/response.utils.js";
import routes from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/", (_req, res) => {
    responseUtils.successResponse(res, { data: ENV, message: "Referral System API is running" });
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
});


const PORT = Number(ENV.PORT);

app.listen(PORT, () => {
    console.log(`Referral System API is running on port ${PORT}`);
});


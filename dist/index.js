import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import mongoose from "mongoose";
import { swaggerSpec } from "./configs/swagger.js";
import { successResponse } from "./utils/response.utis.js";
import ENV from "./ENV.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// Swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Health check
app.get("/", (_req, res) => {
    successResponse(res, { data: ENV, message: "Referral System API is running" });
});
app.get("/health", (_req, res) => {
    const dbConnected = mongoose.connection.readyState === 1;
    successResponse(res, { data: { dbConnected }, message: "Health check", statusCode: 200 });
});
const PORT = Number(ENV.PORT);
app.listen(PORT, () => {
    console.log(`Referral System API is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
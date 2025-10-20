import { config } from "@dotenvx/dotenvx";

config();

export default {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || "4000",
    MONGO_URI: process.env.MONGO_URI,

    JWT: {
        secret: process.env.JWT_SECRET || "secret",
        tokenExpireIn: "1h",
        refreshTokenExpireIn: "7d",
        saltRounds: 10,
    },

    FIRST_PURCHASE_CREDITS: 2,
} as const;

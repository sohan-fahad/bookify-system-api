import { config } from "@dotenvx/dotenvx";
config();
export default {
    MODE: process.env.MODE || "development",
    PORT: process.env.PORT || "4000",
};
//# sourceMappingURL=ENV.js.map
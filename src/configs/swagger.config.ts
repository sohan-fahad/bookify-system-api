import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Referral System API",
            version: "1.0.0",
            description: "A referral system API for users and referrals",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["src/modules/**/*.route.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
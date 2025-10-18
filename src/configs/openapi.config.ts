import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { referralQuerySchema } from '../modules/referral/referral.schema';

const registry = new OpenAPIRegistry();

// Register your schemas
registry.register('Referral', referralSchema);

// Register paths
registry.registerPath({
    method: 'get',
    path: '/api/v1/referral',
    tags: ['Referral'],
    request: { query: referralQuerySchema },
    responses: {
        200: { description: 'Success' },
    },
});

const generator = new OpenApiGeneratorV3(registry.definitions);
const openApiSpec = generator.generateDocument({
    openapi: '1.0.0',
    info: { title: 'Referral API', version: '1.0.0' },
});


export default openApiSpec;
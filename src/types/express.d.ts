import { ITokenResponsePayload } from '../interfaces/jwt.interface';

declare global {
    namespace Express {
        interface Request {
            user?: ITokenResponsePayload['user'];
        }
    }
}

export { };
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import ENV from "../ENV.js";

interface ITokenRequestPayload {
    user: {
        id: string | any;
        role: string;
        companyId?: string;
    };
    isRefreshToken?: boolean;
}

interface ITokenResponsePayload extends JwtPayload {
    user: {
        id: string | any;
        role: string;
        companyId?: string;
    };
    isRefreshToken?: boolean;
    iat: number;
    exp: number;
}

const signToken = (payload: ITokenRequestPayload, options?: SignOptions): string => {
    try {
        return jwt.sign(payload, ENV.JWT.secret, options);
    } catch (error: any) {
        throw new Error(`Token signing failed: ${error.message}`);
    }
};


const verifyToken = (token: string): ITokenResponsePayload => {
    try {
        return jwt.verify(token, ENV.JWT.secret) as ITokenResponsePayload;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        }
        throw new Error(`Token verification failed: ${error.message}`);
    }
};

const decodeToken = (token: string): ITokenResponsePayload | null => {
    try {
        return jwt.decode(token) as ITokenResponsePayload;
    } catch (error: any) {
        throw new Error(`Token decoding failed: ${error.message}`);
    }
};

const makeAccessToken = (payload: ITokenRequestPayload): string => {
    return signToken(payload, {
        expiresIn: ENV.JWT.tokenExpireIn,
        audience: 'access',
    });
};

const makeRefreshToken = (payload: ITokenRequestPayload): string => {
    return signToken(
        { ...payload, isRefreshToken: true },
        {
            expiresIn: ENV.JWT.refreshTokenExpireIn,
            audience: 'refresh',
        }
    );
};

const makeTokenPair = (payload: ITokenRequestPayload): {
    accessToken: string;
    refreshToken: string
} => {
    return {
        accessToken: makeAccessToken(payload),
        refreshToken: makeRefreshToken(payload),
    };
};

const isJwtExpired = (exp: number): boolean => {
    const expirationDate = new Date(exp * 1000);
    return Date.now() >= expirationDate.getTime();
};


const isExpiredToken = (token: string): boolean => {
    try {
        const decoded = verifyToken(token);
        return isJwtExpired(decoded.exp);
    } catch (error) {
        // If verification fails, consider it expired
        return true;
    }
};


const validateToken = (token: string): ITokenResponsePayload | null => {
    try {
        const decoded = verifyToken(token);
        if (isJwtExpired(decoded.exp)) {
            return null;
        }
        return decoded;
    } catch (error) {
        return null;
    }
};


const extractTokenFromHeader = (authHeader: string | undefined): ITokenResponsePayload | null => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    return validateToken(token);
};

const getUserIdFromToken = (token: string): string | null => {
    const payload = validateToken(token);
    return payload?.user?.id || null;
};


const getUserRoleFromToken = (token: string): string | null => {
    const payload = validateToken(token);
    return payload?.user?.role || null;
};


const refreshAccessToken = (refreshToken: string): string => {
    const payload = verifyToken(refreshToken);

    if (!payload.isRefreshToken) {
        throw new Error('Invalid refresh token');
    }

    const newPayload: ITokenRequestPayload = {
        user: payload.user,
        isRefreshToken: false,
    };

    return makeAccessToken(newPayload);
};


export default {
    makeAccessToken,
    makeRefreshToken,
    makeTokenPair,

    verifyToken,
    validateToken,
    isExpiredToken,

    extractTokenFromHeader,
    getUserIdFromToken,
    getUserRoleFromToken,

    refreshAccessToken,

    decodeToken,
};

export type { ITokenRequestPayload, ITokenResponsePayload };
interface ITokenRequestPayload {
    user: {
        id: string | any;
        role: string;
    };
    isRefreshToken?: boolean;
}

interface ITokenResponsePayload {
    user: {
        id: string | any;
        role: string;
    };
    isRefreshToken?: boolean;
    iat: number;
    exp: number;
    nbf: number;
    sub: string;
    jti: string;
}


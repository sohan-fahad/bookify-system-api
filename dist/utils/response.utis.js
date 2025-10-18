export const successResponse = (res, data) => {
    return res.status(data.statusCode ? data.statusCode : 200).json({
        success: true,
        message: data.message,
        data: data.data,
    });
};
export const errorResponse = (res, data) => {
    return res.status(data.statusCode ? data.statusCode : 500).json({
        success: false,
        message: data.message,
    });
};
//# sourceMappingURL=response.utis.js.map
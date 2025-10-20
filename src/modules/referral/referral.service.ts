import { Referral } from "./referral.model.js";
import { ReferralQuerySchemaType } from "./referral.schema.js";

const createReferral = async (referrerUserId: string, referredUserId: string) => {
    const referral = await Referral.create({
        referrerUserId,
        referredUserId,
    });
    return referral;
};

const getAll = async (query: ReferralQuerySchemaType) => {
    const { page, limit, sort, referrerUserId, referredUserId, status } = query;

    const sortBy = sort === "asc" ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);

    const queryObject: any = {};

    if (referrerUserId) {
        queryObject.referrerUserId = referrerUserId;
    }

    if (referredUserId) {
        queryObject.referredUserId = referredUserId;
    }

    if (status) {
        queryObject.status = status;
    }

    const referral = await Referral.find(queryObject)
        .limit(Number(limit))
        .skip(skip)
        .sort({ createdAt: sortBy })
        .select("-__v")
        .populate("referredUserId", "name email")
        .lean();

    const total = await Referral.countDocuments(queryObject);

    return {
        data: referral,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
        }
    };
};

const getMetrics = async (userId: string) => {
    const total = await Referral.countDocuments({ referrerUserId: userId });
    const totalConverted = await Referral.countDocuments({ status: "converted", referrerUserId: userId });
    const totalPending = await Referral.countDocuments({ status: "pending", referrerUserId: userId });
    return {
        total,
        totalConverted: totalConverted,
        totalPending: totalPending,
    };
};


export default {
    createReferral,
    getAll,
    getMetrics,
};
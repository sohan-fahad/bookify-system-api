import mongoose, { Schema, Types } from "mongoose";

export enum ReferralStatus {
    PENDING = 'pending',
    CONVERTED = 'converted',
}

export interface IReferral extends Document {
    _id: Types.ObjectId;
    referrerUserId: Types.ObjectId;
    referredUserId: Types.ObjectId;
    status: ReferralStatus;
    creditsAwarded: number;
    convertedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
    {
        referrerUserId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        referredUserId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ReferralStatus,
            default: ReferralStatus.PENDING,
        },
        creditsAwarded: {
            type: Number,
            default: 0,
            min: 0,
        },
        convertedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

ReferralSchema.index({ referrerUserId: 1 });
ReferralSchema.index({ status: 1 });

export const Referral = mongoose.models.Referral || mongoose.model<IReferral>('Referral', ReferralSchema);
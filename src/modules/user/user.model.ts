import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: string;
    referralCode: string;
    referredBy?: Types.ObjectId | null;
    credits: number;
    createdAt: Date;
    updatedAt: Date;
}

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 255,
        },
        role: {
            type: String,
            enum: UserRole,
            default: UserRole.USER
        },
        referralCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        referredBy: {
            type: Types.ObjectId,
            ref: "User",
            default: null,
        },
        credits: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
    },
    { timestamps: true }
);

UserSchema.index({ referredBy: 1 });

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
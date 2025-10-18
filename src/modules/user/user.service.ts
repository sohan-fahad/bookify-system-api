import { RegisterSchemaType } from "../auth/auth.schema";
import User, { IUser } from "./user.model";
import bcryptUtils from "../../utils/bcrypt.utils";
import helperUtils from "../../utils/helper.utils";
import mongoose from "mongoose";
import { Referral } from "../referral/referral.model";
interface UserQuery {
    [key: string]: any;
}


const findOne = async (query: UserQuery): Promise<IUser | null> => {
    return await User.findOne(query);
};

const findMany = async (query: UserQuery = {}): Promise<IUser[]> => {
    return await User.find(query);
};

const findById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
};

const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return await findOne({ email });
};

const findUserByReferralCode = async (
    referralCode: string
): Promise<IUser | null> => {
    return await findOne({ referralCode });
};

const createUser = async (input: RegisterSchemaType) => {
    const hashedPassword = await bcryptUtils.hashPassword(input.password);
    const referralCode = helperUtils.generateReferralCode();

    const { email, ...rest } = input;

    const data: Partial<IUser> = {
        ...rest,
        email,
        referralCode,
        password: hashedPassword,
    };

    let referrer = null;

    if (rest.referralCode) {
        referrer = await findUserByReferralCode(rest.referralCode);
        if (referrer) {
            data.referredBy = referrer._id;
        }
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [newUser] = await User.create([data], { session });

        if (referrer && newUser) {
            await Referral.create([{
                referrerUserId: referrer._id,
                referredUserId: newUser._id,
                creditsAwarded: 0
            }], { session });
        }

        await session.commitTransaction();

        const { password, ...userWithoutPassword } = newUser.toObject();
        return userWithoutPassword;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const updateUser = async (
    id: string,
    input: Partial<IUser>
): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(id, input, { new: true });
};

const deleteUser = async (id: string): Promise<IUser | null> => {
    return await User.findByIdAndDelete(id);
};

const existsByEmail = async (email: string): Promise<boolean> => {
    const user = await findUserByEmail(email);
    return !!user;
};

const existsByReferralCode = async (referralCode: string): Promise<boolean> => {
    const user = await findUserByReferralCode(referralCode);
    return !!user;
};


const updatePassword = async (
    userId: string,
    newPassword: string
): Promise<IUser | null> => {
    const hashedPassword = await bcryptUtils.hashPassword(newPassword);
    return await User.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
    );
};

export default {
    findOne,
    findMany,
    findById,
    findUserByEmail,
    findUserByReferralCode,
    createUser,
    updateUser,
    deleteUser,
    existsByEmail,
    existsByReferralCode,
    updatePassword,
}

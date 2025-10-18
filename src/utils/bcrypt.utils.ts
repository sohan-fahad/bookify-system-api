import bcrypt from "bcryptjs";
import ENV from "../ENV.js";

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, ENV.JWT.saltRounds);
};

const comparePassword = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export default {
    hashPassword,
    comparePassword,
};
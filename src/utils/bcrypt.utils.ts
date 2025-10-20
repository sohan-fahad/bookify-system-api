import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, Number(process.env.JWT_SALT_ROUNDS));
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
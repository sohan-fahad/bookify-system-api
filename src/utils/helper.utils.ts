import { customAlphabet } from "nanoid";


const generateReferralCode = () => {
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    const referralCode = nanoid(6);
    return referralCode;
}

export default {
    generateReferralCode,
};
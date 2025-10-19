import { customAlphabet } from "nanoid";


const generateReferralCode = (userName: string) => {
    const name = userName.toUpperCase().replace(" ", "");
    const nanoid = customAlphabet('0123456789');
    const referralCode = nanoid(6);
    return `${name}${referralCode}`;
}

export default {
    generateReferralCode,
};
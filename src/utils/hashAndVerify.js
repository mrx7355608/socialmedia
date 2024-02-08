import bcrypt from "bcryptjs";

export async function hashString(str) {
    const hashedString = await bcrypt.hash(str, 10);
    return hashedString;
}

export async function verifyString(str, hash) {
    const isValid = await bcrypt.compare(str, hash);
    return isValid;
}

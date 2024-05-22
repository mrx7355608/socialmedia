const bcrypt = require("bcryptjs");

async function hashString(str) {
    const hashedString = await bcrypt.hash(str, 10);
    return hashedString;
}

async function verifyString(str, hash) {
    const isValid = await bcrypt.compare(str, hash);
    return isValid;
}

module.exports = { hashString, verifyString };

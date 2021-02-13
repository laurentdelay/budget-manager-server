const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
    const hashedPass = await bcrypt.hash(password, 12);
    return hashedPass;
};
const checkPassword = async (password, hashedPassword) => {
    const match = bcrypt.compare(password, hashedPassword);
    return match;
};
module.exports = { hashPassword, checkPassword };

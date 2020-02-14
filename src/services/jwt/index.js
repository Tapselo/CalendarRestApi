const jwt = require("jsonwebtoken");
const config = require("../../config");

const sign = (user) => {
    const options = {
        expiresIn: config.jwtExpiration
    };

    return jwt.sign({
        id: user._id,
        userType: user.userType
    }, process.env.JWT_SECRET, options)
};

module.exports = {
    sign
};

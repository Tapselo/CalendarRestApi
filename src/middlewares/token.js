const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});
        req.user = {id: decoded.id};
        next();
    } catch (error) {
        console.error(`Unauthorized error`);
        res.status(401).json({message: "Unauthorized!"}).end();
    }
};
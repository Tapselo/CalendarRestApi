const User = require('../api/users/model')

module.exports = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    User.findOne({ username: username }).then((user) => {
        if (!user) {
            return res.status(401).json({message:"Can't find that user in DB"});
        }
        return user.authenticate(password, user.password).then((user) => {
            if(!user) return res.status(403).json({message:"Wrong password"});

            req.user = user;
            next();

        })
    });

};

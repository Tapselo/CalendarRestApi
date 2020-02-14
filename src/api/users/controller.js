const User = require('./model');
const {sign} = require("../../services/jwt");
const jwt = require("jsonwebtoken");
const config = require("../../config");

const createUser = async ({body}, res, next) => {
    try {
        const user = await User.create(body);
        res.status(201).json({
            message:"New user created:",
            user: user.view(),
            token: sign(user)
        })
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(409).json({
                message: 'Data conflict, change username or email'
            })
        }
        next(err);
    }
};

const loginUser = async (req,res,next) => {
    try{
        const user=req.user;
        const token=sign(user);

        return res.status(200).json({
            user: user.view(),
            token: token
        })
    }catch(er){
        res.status(401).end();
        next();
    }
};

const getUserByName = async ({params}, res, next) => {
    const id = params.id;
    try {
        const user = await User.findById(id);
        if (user) return res.status(200).json(user.view());
        return res.status(404);
    } catch (e) {
        next(e);
    }
};

const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const {username,email,password,userType} = req.body;
    try {
        check(req);
        const user = await User.findById(id);
        if (user) {
            if(username)
            user.username = username;
            if(email)
            user.email = email;
            if(password)
            user.password = password;
            if(userType)
            user.userType=userType;
            await user.save();
            return res.json({message:"User updated",updated: user.view()});
        } else {
            return res.status(404);
        }
    } catch (err) {

        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    try {
        check(req);
        const user = await User.findById(id);
        if(user){
            await user.remove();
            return res.status(200).json({message:"User removed"});
        }
        return res.status(404).end();
    } catch (err) {
        if (err.name === 'PermissionIssue') {
            return res.status(403);
        }
        next(err)
    }
};

function check(req){
    const id=req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});
    if(decoded.id !== id){
        if(decoded.userType !=='superuser') {
            throw new Error('PermissionIssue');
        }
    }
}


module.exports = {
    createUser, getUserByName,updateUser,deleteUser,loginUser
};

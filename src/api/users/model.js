const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 4,
        maxLength: 32
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    userType: {
        type: String,
        required: true,
        enum: ['user','superuser'],
        default: 'user'
    }
});

UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    const rounds = 8;
    bcrypt.hash(this.password, rounds).then((hash) => {
        this.password = hash;
        next()
    }).catch(next)
});

UserSchema.methods = {
    view () {
        let fields = ['id', 'username', 'email', 'userType'];
        let view = {};

        fields.forEach((field) => { view[field] = this[field] });
        return view
    },

    authenticate (password) {
        return bcrypt.compare(password, this.password).then((valid) => valid ? this : false)
    },
};

module.exports = mongoose.model('User', UserSchema);
/*
module.exports = {
    User: mongoose.model('User', UserSchema),
    UserSchema
};
*/

'use strict';
const User = require('../src/api/users/model');
const mongoose = require('../src/services/mongoose');
const assert = require('assert');

describe('Users unit tests ', () => {

    before((done) => {
        mongoose.connection.collections.users.drop(() => { done() });
    });

    describe('#UserUnitTests', () => {
        it('creates an user', (done) => {
            var user = new User({
                username:"User",
                email:"User@userpage.com",
                password:"user123",
                userType:"user"
            });
            user.save().then(() => {
                assert(!user.isNew);
                done();
            })
        });

        it('finds user with the username', (done) => {
            User.findOne({username: 'User'})
                .then((user) => {
                    assert(user.username === 'User');
                    done();
                });
        });

        it('gets ValidationError when adding an empty user', (done) => {
            const user = new User({});
            user.save((err) => {
                assert(err.name === 'ValidationError');
                done();
            });
        });

        it('updates user in database with new username', (done) =>{
            const filter = { username: 'User' };
            const update = { username: 'NewGuy' };
            User.findOneAndUpdate(filter, update, {new:true})
                .then((user) => {
                    assert(user.username==='NewGuy');
                    done();
                });
        });

        it('deletes user from db', (done) =>{
            User.findOneAndDelete({ username: 'NewGuy'})
                .then((user) => {
                    assert(user.username==='NewGuy');
                    done();
            });
        });
    })
});

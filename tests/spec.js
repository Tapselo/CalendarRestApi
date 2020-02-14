'use strict';
const request = require('supertest');
const chai = require('chai');
const app = require('../src/app');
const mongoose = require('../src/services/mongoose');
const expect = chai.expect;

describe('API integrations tests', () => {
    before((done) => {
        mongoose.connection.collections.users.drop(() => { });
        mongoose.connection.collections.events.drop(()=>{ done() });
        });
    after((done) => {
       mongoose.connection.collections.users.drop(() => { });
       mongoose.connection.collections.events.drop(()=>{ done() });
    });

    var token={};
    var userid="";
    var eventid="";

    describe('#POST /api/users', () => {
        it('should add an user', (done) => {
            request(app).post('/api/users/')
                .set('Accept', 'application/json')
                .send({
                    "username":"user",
                    "email":"user@gmail.com",
                    "password":"user123",
                    "userType":"user"
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.all.keys(['message','token','user']);
                    expect(res.body.user).to.have.all.keys(['id','username','email','userType']);
                    done();
                });
        });

        it('should return 403 when users does not have a name', (done) => {
            request(app).post('/api/users')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(403);
                    done();
                });
        });
        it('should return 409 when trying to duplicate the user', (done) => {
            request(app).post('/api/users/')
                .set('Accept', 'application/json')
                .send({
                    "username":"user",
                    "email":"user@gmail.com",
                    "password":"user123",
                    "userType":"user"
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(409);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
        it('should login a fresh new user', (done) => {
            request(app).post('/api/users/login')
                .set('Content-type', 'application/json')
                .auth('user', 'user123')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.all.keys(['token','user']);
                    expect(res.body.user).to.have.all.keys(['id','username','email','userType']);
                    token=res.body.token;
                    userid=res.body.user.id;
                    done();
                });
        });
    });

    describe('#POST /api/events', () => {
        it('should add a new event for created user', (done) => {
            request(app).post('/api/events')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    "title":"New Event",
                    "place":"Cracow",
                    "date":"04.01.2020",
                    "weather":"Sunny",
                    "user_id":""+userid
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(201);
                    expect(res.body).to.have.all.keys(['event']);
                    expect(res.body.event).to.have.all.keys(['id','title','date','place','weather']);
                    eventid=res.body.event.id;
                    done();
                });
        });
        it('should return 403 when missing an event title', (done) => {
            request(app).post('/api/events')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    "place":"Cracow",
                    "date":"04.01.2020",
                    "weather":"Sunny",
                    "user_id":""+userid
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(403);
                    done();
                });
        });
    });

    describe('#GET /api/events', () => {
        it('should get a list of events of a user', (done) => {
            request(app).get('/api/events')
                .set('Content-type', 'application/json')
                .set('Authorization','Bearer ' + token)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.be.an('object');
                    done();
                });
        });

    });

    describe('#PUT /api/events/'+eventid, () => {
        it('should update an event', (done) => {
            request(app).put('/api/events/'+eventid)
                .set('Content-type', 'application/json')
                .set('Authorization','Bearer ' + token)
                .send({
                    "title":"Update"
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.be.an('object');
                    done();
                });
        });
    });

    describe('#PUT /api/events/'+eventid, () => {
        it('should delete an event', (done) => {
            request(app).delete('/api/events/'+eventid)
                .set('Content-type', 'application/json')
                .set('Authorization','Bearer ' + token)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    var mes=res.body.message;
                    expect(res.body).to.have.all.keys(['message']);
                    expect(mes).to.equal('Event deleted');
                    done();
                });
        });

    });

});

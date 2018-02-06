process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");

var Chat = require('./models/Chat');
var app = require('./app');

var should = chai.should();
chai.use(chaiHttp);


describe('Chats', function () {

    Chat.collection.drop();

    beforeEach(function (done) {
        var newChat = new Chat({
            room: 'Java',
            nickname: 'Vishalan',
            message: 'Hi',
            liked_by: null,
            liked_count: 0,
            updated_at: new Date()

        });
        newChat.save(function (err) {
            done();
        });
    });
    afterEach(function (done) {
        Chat.collection.drop();
        done();
    });

    it('should list ALL chats on /chats GET', function (done) {
        var newChat = new Chat({
            room: 'Java',
            nickname: 'Vishalan',
            message: 'Hi',
            liked_by: null,
            liked_count: 0,
            updated_at: new Date()
        });
        newChat.save(function (err, data) {
            chai.request(app)
                .get('/chat/room/Java')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('_id');
                    res.body[0].should.have.property('room');
                    res.body[0].should.have.property('nickname');
                    res.body[0].room.should.equal('Java');
                    res.body[0].nickname.should.equal('Vishalan');
                    res.body[0].message.should.equal('Hi');
                    done();
                });
        });
    });

    it('should list a SINGLE chat on /chat/<id> GET', function (done) {
        var newChat = new Chat({
            room: 'Java',
            nickname: 'Vishalan',
            message: 'Hi',
            liked_by: null,
            liked_count: 0,
            updated_at: new Date()
        });
        newChat.save(function (err, data) {
            chai.request(app)
                .get('/chat/' + data.id)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('nickname');
                    res.body.should.have.property('room');
                    res.body.should.have.property('message');
                    res.body.nickname.should.equal('Vishalan');
                    res.body.message.should.equal('Hi');
                    res.body.room.should.equal('Java');
                    res.body._id.should.equal(data.id);
                    done();
                });
        });
    });

    it('should add a SINGLE Chat on /chats POST', function (done) {
        chai.request(app)
            .post('/chat')
            .send({
                room: 'Java',
                nickname: 'Vishalan',
                message: 'Hi',
                liked_by: null,
                liked_count: 0,
                updated_at: new Date()
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                    res.body.should.have.property('nickname');
                    res.body.should.have.property('room');
                    res.body.should.have.property('message');
                    res.body.nickname.should.equal('Vishalan');
                    res.body.message.should.equal('Hi');
                    res.body.room.should.equal('Java');
                done();
            });
    });

    it('should update a SINGLE Chat on /Chat/<id> PUT', function (done) {
        chai.request(app)
            .get('/chat/room/Java')
            .end(function (err, res) {
                chai.request(app)
                    .put('/chat/' + res.body[0]._id)
                    .send({ 'like_count': 1, 'liked_by': [{ 'name': 'Vishalan' }] })
                    .end(function (error, response) {
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('nickname');
                        response.body.should.have.property('room');
                        response.body.should.have.property('message');
                        response.body.nickname.should.equal('Vishalan');
                        response.body.message.should.equal('Hi');
                        response.body.room.should.equal('Java');
                        done();
                    });
            });
    });

    it('should delete a SINGLE Chat on /chat/<id> DELETE', function (done) {
        chai.request(app)
            .get('/chat/room/Java')
            .end(function (err, res) {
                chai.request(app)
                    .delete('/chat/' + res.body[0]._id)
                    .end(function (error, response) {
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('nickname');
                        response.body.should.have.property('room');
                        response.body.should.have.property('message');
                        response.body.nickname.should.equal('Vishalan');
                        response.body.message.should.equal('Hi');
                        response.body.room.should.equal('Java');
                        done();
                    });
            });
    });

});
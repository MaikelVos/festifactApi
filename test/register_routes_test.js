const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const db = require('../db/databaseConnector');

chai.should();
chai.use(chaiHttp);

// After successful registration we have a valid token. We export this token
// for usage in other testcases that require login.


function deleteClient() {
    db.query('DELETE FROM ni1783395_2_DB.User WHERE email = "sjaak@gmail.com"'), function (err) {
        if (err) {
            console.log(err);
        }
    };
    db.query('DELETE FROM ni1783395_2_DB.User WHERE email = "sjaakAdmin@gmail.com"'), function (err) {
        if (err) {
            console.log(err);
        }
    };
}

describe('Registration', function () {
    this.timeout(10000);

    before(function () {
        deleteClient();
    });



    it('CLIENT: should return a 201 status when providing valid information', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "maikel",
                "infix": "",
                "lastname": "test",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678",
                "city" : "Breda",
                "address" : "Beukenlaan 9",
                "zipcode" : "7676 AS",
                "role" : "User"
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: should return a 201 status when providing valid admin information', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "maikel",
                "infix": "",
                "lastname": "test",
                "dob": "1996-11-27",
                "email": "sjaakAdmin@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678",
                "city" : "Breda",
                "address" : "Beukenlaan 9",
                "zipcode" : "7676 AS",
                "role" : "Admin"
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            });
    });



    it('CLIENT: should throw an error when the user already exists', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "sjaak",
                "infix": "",
                "lastname": "Neus",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678",
                "city" : "Breda",
                "address" : "Zuidsingel 8",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(420);
                res.body.should.be.a('object');
                done();
            });
    });



    it('CLIENT: should throw an error when no firstname is provided', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "",
                "infix": "",
                "lastname": "Neus",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678",
                "city" : "Breda",
                "address" : "Zuidsingel 8",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                deleteClient();
                done();
            });
    });



    it('CLIENT: should throw an error when firstname is shorter than 2 chars', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "k",
                "infix": "",
                "lastname": "Neus",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678",
                "city" : "Breda",
                "address" : "Zuidsingel 8",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                deleteClient();
                done();
            });
    });



    it('CLIENT: should throw an error when no lastname is provided', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "sjaak",
                "infix": "",
                "lastname": "",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678",
                "city" : "Breda",
                "address" : "Zuidsingel 8",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                deleteClient();
                done();
            });
    });



    it('CLIENT: should throw an error when lastname is shorter than 2 chars', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "Sjaak",
                "infix": "",
                "lastname": "N",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678",
                "city" : "Breda",
                "address" : "Zuidsingel 8",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                deleteClient();
                done();
            });
    });



    it('CLIENT: should throw an error when email is invalid', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "Sjaak",
                "infix": "",
                "lastname": "Neus",
                "dob": "1996-11-27",
                "email": "@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678",
                "city" : "Breda",
                "address" : "Zuidsingel 8",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                deleteClient();
                done();
            });
    });




    it('CLIENT: should throw an error when phonenumber is too long', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "Sjaak",
                "infix": "",
                "lastname": "Neus",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678000000000000000000000000000",
                "city" : "Breda",
                "address" : "Zuidsingel 8",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                deleteClient();
                done();
            });
    });





    it('CLIENT: should throw an error when password is invalid', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "Sjaak",
                "infix": "",
                "lastname": "Neus",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwertytfjguhiljktguh@#",
                "phonenumber": "062345678",
                "city" : "Breda",
                "address" : "Zuidsingel 8",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                deleteClient();
                done();
            });
    });

    it('CLIENT: should throw an error when city is invalid', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "Sjaak",
                "infix": "",
                "lastname": "Neus",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwertyt123",
                "phonenumber": "062345678",
                "city" : "123",
                "address" : "Zuidsingel 8",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                deleteClient();
                done();
            });
    });

    it('CLIENT: should throw an error when adress is invalid', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "Sjaak",
                "infix": "",
                "lastname": "Neus",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwertyt123",
                "phonenumber": "062345678",
                "city" : "Breda",
                "address" : "123",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                deleteClient();
                done();
            });
    });

    it('CLIENT: should throw an error when zipcode is invalid', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "Sjaak",
                "infix": "",
                "lastname": "Neus",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwertyt123",
                "phonenumber": "062345678",
                "city" : "Breda",
                "address" : "zuidsingel 8",
                "zipcode" : "420"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                deleteClient();
                done();
            });
    });

    after(function () {

        deleteClient();
        //process.exit();
    });
});
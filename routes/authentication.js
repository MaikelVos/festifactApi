const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const db = require('../db/databaseConnector');
const Errors = require('../models/Errors');
const Psychologist = require('../models/Psych');
const Client = require('../models/Client');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const global = require('../globalFunctions');

router.post("/login/:role", (req, res) => {
    let role = req.params.role;
    let email = req.body.email || '';
    let password = req.body.password || '';

    // If the requested user is a psychologist.
    if (role === 'psychologist') {
        // Checks if the provided email exists in the database.
        db.query("SELECT email, password FROM mdod.Psychologist WHERE email = ?", [email], function (err, rows, fields) {
            if (err) {
                res.status(500).json(err);
                return;
            }
            // Checks if the database gave back a valid return, if not, return error not found.
            if (rows.length < 1) {
                let error = Errors.notFound();
                res.status(error.code).json(error);
                return;
            }
            // Compares the provided password with the password in the database.
            bcrypt.compare(password, rows[0].password, (err, result) => {
                if (err) {
                    res.json(err);
                    return;
                }
                // Checks the email as well as an extra check, if correct return a token and HTTP 200. Else return a unauthorized code.
                if (email === rows[0].email && result) {
                    let token = auth.encodeToken(email);
                    res.status(200).json({
                        "token": token,
                        "status": 200,
                        "parameters": res.body
                    });
                } else {
                    let error = Errors.unauthorized();
                    res.status(error.code).json(error);
                }
            });

        })
    }
    // If the requested user is a client.
    else if (role === 'client') {

        // Checks if the provided email exists in the database.
        db.query("SELECT email, password FROM mdod.Client WHERE email = ?", [email], function (err, rows, fields) {
            if (err) {
                res.status(500).json(err);
                return;
            }
            // Checks if the database gave back a valid return, if not, return error not found.
            if (rows.length < 1) {
                let error = Errors.notFound();
                res.status(error.code).json(error);
                return;
            }

            // Compares the provided password with the password in the database.
            bcrypt.compare(password, rows[0].password, (err, result) => {
                if (err) {
                    res.json(err);
                }
                // Checks the email as well as an extra check, if correct return a token and HTTP 200. Else return a unauthorized code.
                if (email === rows[0].email && result) {
                    let token = auth.encodeToken(email);
                    res.status(200).json({
                        "token": token,
                        "status": 200,
                        "parameters": res.body
                    });
                } else {
                    let error = Errors.unauthorized();
                    res.status(error.code).json(error);
                }
            });
        })
    } else {
        const err = Errors.badRequest();
        res.status(err.code).json(err);
    }
});

router.post("/register/:role", (req, res) => {
    // Define the properties for a user.
    const email = req.body.email || "";
    const password = req.body.password || "";
    const firstname = req.body.firstname || "";
    const infix = req.body.infix || "";
    const lastname = req.body.lastname || "";
    const phonenumber = req.body.phonenumber || "";

    // If the registered user is a psychologist.
    if (req.params.role === "psychologist") {
        // Define the properties for a psychologist.
        const location = req.body.location || "";

        // Create a new Psychologist. If the validation of this user fails this object contains an error message.
        const psychologist = new Psychologist(email, password, firstname, infix, lastname, location, phonenumber);

        // Check if the psychologist a valid psychologists is, and not the error message.
        if (psychologist._email) {
            // Generate a salt for the hash method.
            bcrypt.genSalt(saltRounds, function (err, salt) {

                // Hash the plain text password to a bcrypt hash.
                bcrypt.hash(password, salt, function (err, hash) {

                    // Check if the email address already exists in the database.
                    db.query("SELECT email FROM mdod.Psychologist WHERE email = ?", [email], (error, rows, fields) => {
                        if (error) {
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                            return;
                        }

                        // If the email address exists. return a conflict error.
                        if (rows.length > 0) {
                            const error = Errors.userExists();
                            res.status(error.code).json(error);
                            return;
                        }

                        // If the email doesn't exists in the database, insert it.
                        db.query("INSERT INTO mdod.Psychologist VALUES(?, ?, ?, ?, ?, ?, ?)", [email, hash, phonenumber, location, firstname, infix, lastname], (error, result) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(error)
                            }

                            res.status(201).json({
                                message: "Psycholoog aangemaakt"
                            })
                        })
                    });
                })
            });
        } else {
            // If the psychologist is not a real psychologist but the error method.
            res.status(psychologist.code).json(psychologist);
        }

        // If the role is a client.
    } else if (req.params.role === "client") {
        // Define the properties for a client (Sub class).
        const dob = req.body.dob || "";
        const city = req.body.city || "";
        const address = req.body.adress || "";
        const zipCode = req.body.zipcode || "";

        // Create a new Client. If the validation fails, the client becomes an error message.
        const client = new Client(email, password, firstname, infix, lastname, phonenumber, dob, city, address, zipCode);

        // If the client is a real client, and not the error message.
        if (client._email) {
            // Generate salt.
            bcrypt.genSalt(saltRounds, function (err, salt) {

                // Hash password.
                bcrypt.hash(password, salt, function (err, hash) {

                    // Check if user already exists
                    db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (error, rows, fields) => {
                        if (error) {
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                            return;
                        }

                        // If user exists. return conflict error.
                        if (rows.length > 0) {
                            const error = Errors.userExists();
                            res.status(error.code).json(error);
                            return;
                        }

                        // If the user doesn't exist. Insert it.
                        db.query("INSERT INTO mdod.Client VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [client._email, null, hash, client._phonenumber, client._dob, client._city, client._address, client._zipCode, client._firstname, client._infix, client._lastname], (error, result) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(error);
                                return;
                            }

                            res.status(201).json({
                                message: "Client aangemaakt"
                            })
                        })
                    });
                });
            });
        } else {
            // If the user object contains the error message.
            res.status(client.code).json(client);
        }
    } else {
        const err = Errors.badRequest();
        res.status(err.code).json(err);
    }

});

router.get('/:role', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const role = req.params.role;
    if (role === 'client') {
        const data = auth.decodeToken(token, (err, payload) => {
            if (err) {
                console.log('Error handler: ' + err.message);
                let error = Errors.noValidToken();
                res.status(error.code).json(error);
            } else {
                const email = payload.sub;
                db.query("SELECT email, contact, firstname, infix, lastname, phonenumber, birthday, city, adress, zipcode FROM mdod.Client WHERE email = ?;", [email], (error, rows, field) => {
                    if (error) {
                        const err = Errors.unknownError();
                        res.status(err.code).json(err);
                        return;
                    }
                    if (rows.length < 1) {
                        let error = Errors.notFound();
                        res.status(error.code).json(error);
                        return;
                    }
                    if (rows.length > 0) {
                        res.status(200).json(rows);
                    }
                });
            }
        });
    } else if (role === 'psychologist') {
        const data = auth.decodeToken(token, (err, payload) => {
            if (err) {
                console.log('Error handler: ' + err.message);
                let error = Errors.noValidToken();
                res.status(error.code).json(error);
            } else {
                const email = payload.sub;
                db.query("SELECT email, firstname, infix, lastname, phonenumber, job_location FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows, field) => {
                    if (error) {
                        const err = Errors.unknownError();
                        console.log(error);
                        res.status(err.code).json(err);
                        return;
                    }
                    if (rows.length < 0) {
                        let error = Errors.notFound();
                        res.status(error.code).json(error);
                        return;
                    }
                    if (rows.length > 0) {
                        res.status(200).json(rows);
                    }
                });
            }
        });
    } else {
        const err = Errors.badRequest();
        res.status(err.code).json(err);
    }
});

router.put("/:role", (req, res) => {
    const role = req.params.role;
    if (role === 'client') {
        const password = "qwerty123";
        const firstname = req.body.firstname || "";
        const infix = req.body.infix || "";
        const lastname = req.body.lastname || "";
        const phonenumber = req.body.phonenumber || "";
        const dob = req.body.dob || "";
        const city = req.body.city || "";
        const address = req.body.adress || "";
        const zipCode = req.body.zipcode || "";
        const token = global.stripBearerToken(req.header('Authorization'));
        const data = auth.decodeToken(token, (err, payload) => {
            if (err) {
                console.log('Error handler: ' + err.message);
                let error = Errors.noValidToken();
                res.status(error.code).json(error);
            } else {
                const email = payload.sub;
                const client = new Client(email, password, firstname, infix, lastname, phonenumber, dob, city, address, zipCode);
                if (client._email) {
                    db.query("UPDATE mdod.Client SET phonenumber = ?, birthday = ?, city = ?, adress = ?, zipcode =?, firstname = ?, infix =?, lastname = ? WHERE email = ? ", [phonenumber, dob, city, address, zipCode, firstname, infix, lastname, email], (error, result) => {
                        if (error) {
                            const err = Errors.conflict();
                            res.status(err.code).json(err);
                            return;
                        }
                        res.status(202).json({message: "Client Aangepast"})
                    });
                } else {
                    // If the user object contains the error message.
                    res.status(client.code).json(client);
                }
            }
        });
    } else if (role === 'psychologist') {
        const password = "qwerty123";
        const firstname = req.body.firstname || "";
        const infix = req.body.infix || "";
        const lastname = req.body.lastname || "";
        const phonenumber = req.body.phonenumber || "";
        const location = req.body.location;
        const token = global.stripBearerToken(req.header('Authorization'));
        const data = auth.decodeToken(token, (err, payload) => {
            if (err) {
                console.log('Error handler: ' + err.message);
                let error = Errors.noValidToken();
                res.status(error.code).json(error);
                return;
            } else {
                const email = payload.sub;
                const psychologist = new Psychologist(email, password, firstname, infix, lastname, location, phonenumber);
                if (psychologist._email) {
                    db.query("UPDATE mdod.Psychologist SET phonenumber = ?, job_location = ?, firstname = ?, infix =?, lastname = ? WHERE email = ? ", [phonenumber, location, firstname, infix, lastname, email], (error, result) => {
                        if (error) {
                            const err = Errors.conflict();
                            res.status(err.code).json(err);
                            return;
                        }
                        res.status(202).json({message: "Psycholoog Aangepast"})
                    });
                } else {
                    // If the user object contains the error message.
                    res.status(psychologist.code).json(psychologist);
                }
            }
        });
    } else {
        const err = Errors.badRequest();
        res.status(err.code).json(err);
    }
});

router.delete("/:role", (req, res) => {
    const role = req.params.role;
    const token = global.stripBearerToken(req.header('Authorization'));
    const data = auth.decodeToken(token, (err, payload) => {
        const email = payload.sub;
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            if (role === 'client') {
                db.query("DELETE FROM mdod.Client WHERE email = ?;", [email], (error, result) => {
                    if (error) {
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }
                    res.status(202).json({message: "Cliënt Verwijderd"})
                });
            }
            else if (role === 'psychologist') {
                db.query("DELETE FROM mdod.Psychologist WHERE email = ?;", [email], (error, result) => {
                    if (error) {
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }
                    res.status(200).json({message: "Psycholoog Verwijderd"});
                });
            } else {
                const err = Errors.badRequest();
                res.status(err.code).json(err);
            }
        }
    });
});

module.exports = router;
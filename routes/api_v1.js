const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');

//Routing files
const festival = require('./festival');
// const risks = require('./risks');
// const difficult_moment = require('./difficult_moments');
// const addiction = require('./addiction');
const global = require('../globalFunctions');
// const usage = require('./usage');
// const usageData = require('./usageData');
// const mood = require('./mood');
// const substance = require('./substance');
// const phone = require('./phonenumbers');
// const note = require('./note');
// const messages = require('./messages');

//Routers for goals and risks and difficult moments
router.use('/festival', festival);
// router.use('/risk', risks);
// router.use('/addiction', addiction);
// router.use('/difficult_moment', difficult_moment);
// router.use('/usage', usage);
// router.use('/usage/client/data', usageData);
// router.use('/mood', mood);
// router.use('/substance', substance);
// router.use('/phone', phone);
// router.use('/note', note);
// router.use('/messages', messages);

/*
 * Role routes
 */

//Get all by role
router.get('/all/:role', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const role = req.params.role;

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            //Get all clients
            if (role === 'client') {
                const email = payload.sub;

                global.checkIfEmailIsPsychologistEmail(email, (error, psychRows) => {
                    if (error) {
                        res.status(error.code).json(error);
                        return;
                    } else {
                        db.query("SELECT email, firstname, infix, lastname FROM ni1783395_2_DB.User", [email], (error, rows) => {
                            // Query/DB Error.
                            if (error) {
                                const err = Errors.unknownError();
                                res.status(err.code).json(err);
                                return;
                            }

                            // No results.
                            if (rows.length < 1) {
                                let error = Errors.notFound();
                                res.status(error.code).json(error);
                                return;
                            }

                            // Return results.
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
        }
    });
});

//Get Client from Psychologist
router.post('/specific/:role', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const role = req.params.role;

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            if (role === 'client') {
                const email = payload.sub;
                const client_email = req.body.email || "";

                global.checkIfEmailIsPsychologistEmail(email, (error, psychRows) => {
                    if (error) {
                        res.status(error.code).json(error);
                        return;
                    } else {
                        db.query("SELECT email, contact, phonenumber, birthday, city, adress, zipcode, firstname, infix, lastname FROM ni1783395_2_DB.User WHERE email = ?;", [client_email], (error, rows) => {
                            // DB/Query Error.
                            if (error) {
                                const err = Errors.unknownError();
                                res.status(err.code).json(err);
                                return;
                            }

                            // No results.
                            if (rows.length < 1) {
                                let error = Errors.notFound();
                                res.status(error.code).json(error);
                                return;
                            }

                            // Return result.
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
        }
    });
});

//Add Psychologist to Client
router.put('/pickclient', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            const error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            let email = payload.sub;
            const client_email = req.body.email || "";
            const insert_delete = req.body.insert || "";

            global.checkIfEmailIsPsychologistEmail(email, (error, psychRows) => {
                if (error) {
                    res.status(error.code).json(error);
                    return;
                } else {
                    global.checkIfEmailIsClientEmail(client_email, (error, clientRow) => {
                        if (error) {
                            res.status(error.code).json(error);
                            return;
                        } else {
                            if (insert_delete === "0") {
                                email = null;
                            }
                            //Add Psychologist to Client
                            db.query("UPDATE ni1783395_2_DB.User SET contact = ? WHERE email = ?", [email, client_email], (error, result) => {
                                if (error) {
                                    const err = Errors.unknownError();
                                    res.status(err.code).json(err);
                                }
                                res.status(202).json({
                                    message: "Client Aangepast"
                                })
                            });
                        }
                    })
                }
            });
        }
    });
});

// Get clients from a psychologist.
router.get('/clients-by-psychologist', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            // Get Clients by psychologist email.
            const email = payload.sub;

            global.checkIfEmailIsPsychologistEmail(email, (error, psychRows) => {
                if (error) {
                    res.status(error.code).json(error);
                } else {
                    db.query("SELECT email, firstname, infix, lastname FROM ni1783395_2_DB.User WHERE contact = ?", [email], (error, rows) => {
                        if (error) {
                            console.log(error);
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                        }
                        res.status(200).json(rows)
                    });
                }
            });
        }
    });
});

module.exports = router;
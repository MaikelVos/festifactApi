const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Festival = require('../models/Festival');
const global = require('../globalFunctions');

/**
 * Get all festivals.
 */
router.get('/all', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            db.query("SELECT * FROM ni1783395_2_DB.GetFestivals", (error, rows) => {
                if (error) {
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                } else {
                    res.status(200).json(rows);
                }
            });
        }
    });
});

/**
 * Get all festivals for organiser.
 */
router.post(`/new`, (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    auth.decodeToken(token, (err, payload) => {
        const email = payload.sub;
        const {
            v1: uuidv1,
        } = require('uuid');
        const Id = uuidv1();
        const festivalLocations = req.body.festivalLocations || "";
        const name = req.body.name || "";
        const description = req.body.description || "";
        const startdate = req.body.startdate || "";
        const enddate = req.body.enddate || "";
        const organiser = req.body.organiser || "";
        const tickets = req.body.tickets || "";

        const Festival = new Festival();

        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            //Check for user, if it may make a festival
            db.query("SELECT * FROM ni1783395_2_DB.GetFestivalsOrganiser where email = '" + email + "'", (error, rows) => {
                if (error) {
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                } else {

                    // Check if Festival already exists
                    db.query("SELECT email FROM ni1783395_2_DB.Festival WHERE email = ?", [email], (error, result, fields) => {
                        if (error) {
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                            return;
                        }

                        // If user exists. return conflict error.
                        if (result.length > 0) {
                            const error = Errors.userExists();
                            res.status(error.code).json(error);
                            return;
                        }

                        // If the user doesn't exist. Insert it.
                        db.query("INSERT INTO ni1783395_2_DB.User VALUES(?, ?, ?,  ?, ?, ?, ?, ?, ?, ?, ?, ?)", [Id, client._email,  hash, client._phonenumber, client._dob, client._city, client._address, client._zipCode, client._firstname, client._infix, client._lastname, role], (error, result) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(error);
                                return;
                            }

                            res.status(201).json({
                                message: "User aangemaakt"
                            })
                        })
                    });


                    res.status(200).json(rows);
                }
            });
        }
    });
});

/**
 * Get all festivals for organiser.
 */
router.get(`/all/organiser`, (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));

    auth.decodeToken(token, (err, payload) => {
        const email = payload.sub;
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            db.query("SELECT * FROM ni1783395_2_DB.GetFestivalsOrganiser where email = '" + email + "'", (error, rows) => {
                if (error) {
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                } else {
                    res.status(200).json(rows);
                }
            });
        }
    });
});

module.exports = router;
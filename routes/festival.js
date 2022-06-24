const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const festival = require('../models/Festival.Js');
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
        const name = req.body.Name || "";
        const description = req.body.Description || "";
        const startDate = req.body.StartDate || "";
        const endDate = req.body.EndDate || "";
        const ticketAmount = req.body.TicketAmount || "";



        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
            return;
        }
        else {
            //Check for user, if it may make a festival
            db.query("SELECT * FROM ni1783395_2_DB.User where role = 'Admin' and email = '" + email + "'" , (error, result, rows) => {
                if (error) {
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                }
                else {

                    if (result.length !== 1) {
                        const err = Errors.forbidden();
                        res.status(err.code).json(err);
                        return;
                    }

                    const organiser = result[0].firstname;

                    const festivalNw = new festival("", name, description, startDate, endDate, organiser, ticketAmount, ticketAmount);

                    // Check if Festival for user already exists
                    db.query("SELECT * FROM ni1783395_2_DB.GetFestivalsOrganiser WHERE email = ? and name = ?", [email, name], (error, result) => {
                        if (error) {
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                            return;
                        }

                        // If festival exists. return conflict error.
                        if (result.length > 0) {
                            const error = Errors.festivalExists();
                            res.status(error.code).json(error);
                            return;
                        }

                        //If the festival doesn't exist. Insert it.
                        db.query("INSERT INTO ni1783395_2_DB.Festival VALUES(?, ?, ?, ?, ?, ?, ?, 0)", [Id, festivalNw._name,  festivalNw._description, festivalNw._startdate, festivalNw._enddate, festivalNw._organiser, festivalNw._tickets,], (error, result) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(error);
                                return;
                            }

                            res.status(201).json({
                                message: "festival aangemaakt"
                            })
                        })
                    });
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
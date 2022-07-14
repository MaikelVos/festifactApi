const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const location  = require('../models/Location');
const global = require('../globalFunctions');

/**
 * Get all locations.
 */
router.get('/all', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    auth.decodeToken(token, (err) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            db.query("SELECT * FROM ni1783395_2_DB.Locations", (error, rows) => {
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
 * Get all locations for organiser.
 */
router.post(`/add`, (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));

    auth.decodeToken(token, (err, payload) => {

        const email = payload.sub;
        const {
            v1: uuidv1,
        } = require('uuid');
        const Id = uuidv1();
        const locationId = req.body.LocationId || "";
        const festivalId = req.body.FestivalId || "";

        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        }
        else {
            //Check for user, if it may make a festival
            db.query("SELECT * FROM ni1783395_2_DB.User where role = 'Admin' and email = '" + email + "'" , (error, result) => {
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

                    const locationAdd = new location("", festivalId, locationId);

                    // Check if Festival for user already exists
                    db.query("SELECT * FROM ni1783395_2_DB.GetFestivalsOrganiser WHERE email = ? and FestivalId = ?", [email, festivalId], (error, result) => {
                        if (error) {
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                            return;
                        }

                        // If festival exists. return conflict error.
                        if (result.length !== 1) {
                            const error = Errors.locationExists();
                            res.status(error.code).json(error);
                            return;
                        }

                        //If the festival doesn't exist. Insert it.
                        db.query("INSERT INTO ni1783395_2_DB.FestivalLocLnk VALUES(?, ?, ?)", [Id, locationAdd._festivalId,  locationAdd._locationId], (error) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(error);
                                return;
                            }

                            res.status(201).json({
                                message: "Locatie toegevoegd"
                            })
                        })
                    });
                }
            });
        }
    });
});

/**
 * Get all locations for organiser.
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

        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        }
        else {
            //Check for user, if it may make a festival
            db.query("SELECT * FROM ni1783395_2_DB.User where role = 'Admin' and email = '" + email + "'" , (error, result) => {
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

                    const locationAdd = new location(name, "", Id);

                    // Check if Festival for user already exists
                    db.query("SELECT * FROM ni1783395_2_DB.Locations WHERE LocationName = ?", [name], (error, result) => {
                        if (error) {
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                            return;
                        }

                        // If festival exists. return conflict error.
                        if (result.length > 1) {
                            const error = Errors.locationExists();
                            res.status(error.code).json(error);
                            return;
                        }

                        //If the festival doesn't exist. Insert it.
                        db.query("INSERT INTO ni1783395_2_DB.Locations VALUES(?, ?)", [locationAdd._locationId, locationAdd._name], (error) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(error);
                                return;
                            }

                            res.status(201).json({
                                message: "Locatie aangemaakt"
                            })
                        })
                    });
                }
            });
        }
    });
});

module.exports = router;
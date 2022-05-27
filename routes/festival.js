const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
//const Festival = require('../models/Festival');
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
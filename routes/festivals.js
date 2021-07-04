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
            db.query("SELECT FestivalId, Name, Description, StartDate, EndDate, Organiser, TicketAmount FROM ni1783395_1sql1.Festival ORDER BY StartDate DESC;", (error, rows) => {
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
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
            db.query("SELECT (SELECT group_concat(DISTINCT PLACE) as \"Festival location\"\n" +
                "FROM Locations loc\n" +
                "INNER JOIN FestivalLocation floc\n" +
                "ON floc.LocationId = loc.LocationId\n" +
                "WHERE fe.FestivalId = floc.FestivalId\n" +
                "       ) as \"Festival location\",\n" +
                "fe.FestivalId,\n" +
                "fe.Name,\n" +
                "fe.Description,\n" +
                "fe.StartDate,\n" +
                "fe.EndDate,\n" +
                "fe.Organiser,\n" +
                "fe.TicketAmount\n" +
                "FROM Festival fe WHERE fe.EndDate >= NOW()", (error, rows) => {
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
const Errors = require('./Errors');
const global = require('../globalFunctions');

class Festival {
    constructor(festivalLocations, name, description, startDate, endDate, organiser, tickets) {

        this._festivalLocations = festivalLocations;
        this._name = global.checkEmoji(name);
        this._description = global.checkEmoji(description);
        this._startdate = startDate;
        this._enddate = endDate;
        this._organiser = organiser;
        this._tickets = tickets;
    }
}

module.exports = Festival;
const Errors = require('./Errors');
const global = require('../globalFunctions');

class Festival {
    constructor(festivalLocations, name, description, startDate, endDate, organiser, tickets, RemainingTickets) {

        if (!
            (global.checkDate(startDate)
            && global.checkDate(endDate)
            && name && description))
        {
            console.log(global.checkDate(startDate))
            console.log(global.checkDate(endDate))
            console.log(name)
            console.log(description)
            return Errors.badRequest();
        }

        this._festivalLocations = festivalLocations;
        this._name = global.checkEmoji(name);
        this._description = global.checkEmoji(description);
        this._startdate = startDate;
        this._enddate = endDate;
        this._organiser = organiser;
        this._tickets = tickets;
        this._remainingTickets = RemainingTickets;
    }
}

module.exports = Festival;
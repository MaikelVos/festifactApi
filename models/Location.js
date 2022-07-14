const global = require('../globalFunctions');

class Location {
    constructor(LocationName, FestivalId, LocationId) {
        this._name = global.checkEmoji(LocationName);
        this._festivalId = FestivalId;
        this._locationId = LocationId;
    }
}

module.exports = Location;
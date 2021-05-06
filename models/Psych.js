const Errors = require('./Errors');
const global = require('../globalFunctions');

/**
 * Psychologist domain model.
 *
 * This object is validated with regex.
 * Required constructor values:
 * - email
 * - password
 * - firstname
 * - lastname
 *
 * Optional:
 * - infix (insertion)
 * - phonenumber
 * - location
 *
 * All the constructor parameters need to be inserted into the constructors.
 */
class Psychologist {
    constructor(email, password, firstname, infix, lastname, location, phonenumber) {
        if (!(
            email && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z-.]{2,20}/.test(email) &&
            password && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,80}$/.test(password) &&
            firstname && /^([^\d!@#$%^&*()=+~<>]){2,50}$/.test(firstname) &&
            (infix === "" || infix && /^([^\d!@#$%^&*()=+~<>]){2,8}(\s[^\d!@#$%^&*()=+~<>]{2,8})*/.test(infix)) &&
            lastname && /^([^\d!@#$%^&*()=+~<>]){2,50}$/.test(lastname) &&
            (phonenumber === "" || phonenumber && phonenumber.length < 14 && /^\+?\d{6,13}/.test(phonenumber)) &&
            (location === "" || location && /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/.test(location))
        )) {
            return Errors.badRequest();
        }

        this._email = global.checkEmoji(email);
        this._password = global.checkEmoji(password);
        this._firstname = global.checkEmoji(firstname);
        this._infix = global.checkEmoji(infix);
        this._lastname = global.checkEmoji(lastname);
        this._phonenumber = global.checkEmoji(phonenumber);
        this._location = global.checkEmoji(location);
        this._clients = []
    }
}

module.exports = Psychologist;
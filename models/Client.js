const Errors = require('./Errors');
const global = require('../globalFunctions');

/**
 * Client domain model.
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
 * - dob (date of birth)
 * - city
 * - address
 * - zipCode
 *
 * All the constructor parameters need to be inserted into the constructors.
 */
class Client {
    constructor(email, password, firstname, infix, lastname, phonenumber, dob, city, address, zipCode) {
        if (!(
            email && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z-.]{2,20}/.test(email) &&
            password && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,80}$/.test(password) &&
            firstname && /^([^\d!@#$%^&*()=+~<>]){2,50}$/.test(firstname) &&
            (infix === "" || infix && /^([^\d!@#$%^&*()=+~<>]){2,8}(\s[^\d!@#$%^&*()=+~<>]{2,8})*/.test(infix)) &&
            lastname && /^([^\d!@#$%^&*()=+~<>]){2,50}$/.test(lastname) &&
            (phonenumber === "" || phonenumber && phonenumber.length < 14 && /^\+?\d{6,13}$/.test(phonenumber)) &&
            (dob === "" || dob && /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(dob) &&
            (city === "" || city && /^[a-zA-Z]+(?:[\s-'"][a-zA-Z]+)*$/.test(city)) &&
            (address === "" || address && /^([A-Za-z'\-]+\s)+\d+([A-Z-a-z]*)/.test(address)) &&
            (zipCode === "" || zipCode && /^\d{4}\s?[A-Za-z]{2}/.test(zipCode))
        ))) {
            return Errors.badRequest();
        }
        this._email = global.checkEmoji(email);
        this._password = global.checkEmoji(password);
        this._firstname = global.checkEmoji(firstname);
        this._infix = global.checkEmoji(infix);
        this._lastname = global.checkEmoji(lastname);
        this._phonenumber = global.checkEmoji(phonenumber);
        this._dob = dob;
        this._city = global.checkEmoji(city);
        this._address = global.checkEmoji(address);
        this._zipCode = global.checkEmoji(zipCode);
        this._psychologist = null;
    }
}

module.exports = Client;
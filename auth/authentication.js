const config = require('../config');
const moment = require('moment');
const jwt = require('jwt-simple');
const Errors = require('../models/Errors');
const secretKey = process.env.SECRET || config.secretKey;

/**
 * Create the jwt token.
 * @param email The email of the user that is trying to log in.
 * @returns {String} The jwt token will be returned. Hashed with SHA512.
 */
function encodeToken(email) {
    const payload = {
        exp: moment().add(10, 'days').unix(),
        sub: email,
        iat: moment().unix()
    };

    return jwt.encode(payload, secretKey, "HS512", {});
}

/**
 * Decode the JWT token to get the payload.
 * @param token The JWT token that will be decoded.
 * @param cb Callback method (error, payload).
 */
function decodeToken(token, cb) {
    try {
        const payload = jwt.decode(token, secretKey, null, "HS512");

        const now = moment().unix();

        if (now > payload.exp) {
            const error = Errors.noValidToken();
            cb(error, null);
        }

        cb(null, payload);
    } catch (error) {
        cb(error, null);
    }
}

module.exports = {
    encodeToken,
    decodeToken
};